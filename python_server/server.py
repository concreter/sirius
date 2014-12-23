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

# handler
class WebSocketHandler(tornado.websocket.WebSocketHandler):

	# solves 403 error problem, allowing alternate origins
	def check_origin(self, origin):
		return True

	def on_message(self, message):
		global client_objects
		global client_ids
		decoded = json.loads(message)
		if decoded["type"] == "connection__init":
			global index_counter
			client_ids.insert(index_counter, decoded["data"])
			client_objects.insert(index_counter, self)
			index_counter = index_counter + 1
			print("Client " + decoded["data"]["name"] + " connected")
			print(str(client_ids))

	def on_close(self):
		global client_objects
		global client_ids
		index = client_objects.index(self)
		print("Client " + client_ids[index]["name"] + " disconnected")
		client_objects.remove(self)
		del client_ids[index]

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