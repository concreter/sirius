#!/usr/bin/python

import tornado.web
import tornado.websocket
import tornado.ioloop
import json

server_port = 8877

# indexes client name , stats, time etc...
client_ids = []
# indexes client WebSocket object
client_objects = []
# counter which counts index numbers because i want to have ids and ws objects in sync
index_counter = 0

# clientID class, contains client information
class ClientId:
	def __init__(self, name):
		self.name = name

# function returns all clients in list
def get_all_clients():
	global client_ids
	clients = []
	for x in range(len(client_ids)):
		clients.append(client_ids[x].name)
	return clients

# handler
class WebSocketHandler(tornado.websocket.WebSocketHandler):

	# solves 403 error problem, allowing alternate origins
	def check_origin(self, origin):
		return True

	def open(self):
		print("Someone trying to connect")

	def on_message(self, message):

		global client_objects
		global client_ids
		decoded = json.loads(message)
		type = decoded["type"]
		
		if type == "connection__init":
			
			global index_counter

			isConnected = 0
			for x in range(len(client_ids)):

				if decoded["data"]["name"] == client_ids[x].name:
					data = {'type':"connection__init", 'message':"error"}
					self.write_message(json.dumps(data))
					isConnected = 1

			if isConnected == 0:

				new_client = ClientId(decoded["data"]["name"])
				client_ids.insert(index_counter, new_client)
				client_objects.insert(index_counter, self)
				index_counter = index_counter + 1

				print("Client " + decoded["data"]["name"] + " connected")
				data = {'type':"connection__init", 'message':"success"}
				self.write_message(json.dumps(data))
				data = {'type':"clients_list", 'message':get_all_clients()}
				self.write_message(json.dumps(data))
				
		elif type:
			pass

	def on_close(self):

		global client_objects
		global client_ids
		try:
			index = client_objects.index(self)
			print("Client " + client_ids[index].name + " disconnected")
			client_objects.remove(self)
			del client_ids[index]
		except Exception:
			pass
		
# handler end

application = tornado.web.Application([
	(r"/", WebSocketHandler),
])

if __name__ == "__main__":
	application.listen(server_port)
	print("Server started listening on " + str(server_port))
	try:
		tornado.ioloop.IOLoop.instance().start()
	except Exception:
		tornado.ioloop.IOLoop.instance().stop()