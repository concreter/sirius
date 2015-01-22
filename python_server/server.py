#!/usr/bin/python

import tornado.web
import tornado.websocket
import tornado.ioloop
import json
import time
import datetime

server_port = 8873

# indexes client name , stats, time etc...
client_ids = []
# indexes client WebSocket object
client_objects = []
# counter which counts index numbers because i want to have ids and ws objects in sync
index_counter = 10
group_counter = 2
#
groups = []

# clientID class, contains client information
class ClientId:
	def __init__(self, name):
		self.name = name
		self.group = -1
		self.timeStamp = time.time()
		self.online = 1

class Group:

	def __init__(self, master, name, type="default"):
		self.master = master
		self.type = type
		self.name = name
		self.clients = []
		self.clients.append(master)
		self.gameStarted = 0
		self.timestamp = time.time()

	def addClient(self, client):
		self.clients.append(client)

# handler
class WebSocketHandler(tornado.websocket.WebSocketHandler):
	def set_nodelay(self):
		self.set_nodelay(true)
	# solves 403 error problem, allowing alternate origins
	def check_origin(self, origin):
		return True

	def open(self):
		pass

	def on_message(self, message):

		global client_objects
		global client_ids

		decoded = json.loads(message)
		type = decoded["type"]

		if type == "connection__init":

			global index_counter

			isConnected = 0
			for x in range(len(client_ids)):
				if(decoded["data"]["name"] == client_ids[x].name):
					if(client_ids[x].online == 1):
						print(client_ids[x].name + " uz je prihlaseny")
						data = {'type':"connection__init", 'message':{'success':"false"}}
						self.write_message(json.dumps(data))
					else:
						client_objects.insert(x, self)
						client_ids[x].online = 1
						print("Client " + client_ids[x].name + " reconnected")
						if client_ids[x].group > -1:
							gameStarted = groups[client_ids[x].group].gameStarted
						else:
							gameStarted = 0
						data = {'type':"connection__init", 'message':{'success':"true", 'game_started':gameStarted}}
						self.write_message(json.dumps(data))
					isConnected = 1

			if isConnected == 0:
				new_client = ClientId(decoded["data"]["name"])
				client_ids.insert(index_counter, new_client)
				client_objects.insert(index_counter, self)
				index_counter = index_counter + 1
				print("Client " + decoded["data"]["name"] + " connected")
				data = {'type':"connection__init", 'message':{'success':"true", 'game_started':0}}
				self.write_message(json.dumps(data))

		elif type == "group__init":
			global group_counter
			index = client_objects.index(self)
			newGroup = Group(client_ids[index].name, decoded["data"]["name"], group_counter)
			groups.insert(group_counter, newGroup)
			group_counter = group_counter + 1
			data = {'type':"group__init", 'message':"success"}
			self.write_message(json.dumps(data))

		elif type == "group_join":
			index = client_objects.index(self)
			group_id = decoded["data"]["id"]
			groups[group_id].addClient(client_ids[index].name)

			data = {'type':"group_join", 'message':"success"}
			self.write_message(json.dumps(data))

		elif type == "group_clients":
			index = client_objects.index(self)
			returnClients = []
			clients = groups[client_ids[index].group].clients
			for x in range(len(clients)):
				returnClients.append(clients[x])
			data = {'type':"group_clients", 'message':returnClients}
			self.write_message(json.dumps(data))
		elif type == "groups_list":
			returnGroups = []
			for x in range(len(groups)):
				name = groups[x].name
				clientsCount = len(groups[x].clients)
				id = groups[x].id
				returnGroups.append({'name':name, 'clients':clientsCount, 'id':id})
			data = {'type':"groups_list", 'message':returnGroups}
			self.write_message(json.dumps(data))

		elif type == "play_game":
			index = client_objects.index(self)
			if client_ids[index].group == -1:
				availableGroup = 0
				groupId = 0
				for x in range(len(groups)):
					if(len(groups[x].clients) < 4 and groups[x].gameStarted == 0):
						availableGroup = 1
						groupId = x
						break
				if availableGroup == 0:
					newGroup = Group(client_ids[index].name, "group_" + str(group_counter), group_counter)
					groups.insert(group_counter, newGroup)
					client_ids[index].group = groups.index(newGroup)
					group_counter = group_counter + 1
					data = {'type':"group_join", 'message':"success"}
					self.write_message(json.dumps(data))
				else:
					groups[groupId].addClient(client_ids[index].name)
					client_ids[index].group = groupId
					data = {'type':"group_join", 'message':"success"}
					self.write_message(json.dumps(data))
			else:
				data = {'type':"group_join", 'message':"error"}
				self.write_message(json.dumps(data))
	def on_close(self):
		global groups
		global client_objects
		global client_ids
		if self in client_objects:
			index = client_objects.index(self)
			try:
				if client_ids[index].group >= 0:
					if groups[client_ids[index].group].gameStarted == 0:
						if len(groups[client_ids[index].group].clients) == 1:
							del groups[client_ids[index].group]
						else:
							groups[client_ids[index].group].clients.remove(client_ids[index].name)
						client_ids[index].group = -1
			except:
				pass
			print("Client " + client_ids[index].name + " disconnected")
			client_objects.remove(self)
			client_ids[index].timeStamp = time.time()
			client_ids[index].online = 0

# handler end

application = tornado.web.Application([
	(r"/", WebSocketHandler),
])

def clientByName(name):
	for x in range(len(client_ids)):
		if client_ids[x].name == name:
			return x
			break

def groupTime():
	for x in range(len(groups)):
		if (time.time() - groups[x].timestamp > 45 and groups[x].gameStarted == 0 and len(groups[x].clients) > 1):
			groups[x].gameStarted = 1
			for i in range(len(groups[x].clients)):
				index = clientByName(groups[x].clients[i])
				data = {'type':"game_start", 'message':""}
				client_objects[index].write_message(json.dumps(data))
	tornado.ioloop.IOLoop.instance().add_timeout(datetime.timedelta(seconds=1), groupTime)

def clientsTime():
	for x in range(len(client_ids)):
		if(client_ids[x].online == 0 and time.time() - client_ids[x].timeStamp > 30 and client_ids[x].group == -1):
			del client_ids[x]
	tornado.ioloop.IOLoop.instance().add_timeout(datetime.timedelta(seconds=1), clientsTime)

if __name__ == "__main__":
	application.listen(server_port)
	print("Server started listening on " + str(server_port))
	groupTime()
	clientsTime()
	tornado.ioloop.IOLoop.instance().start()
