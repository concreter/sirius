client_id = []
client_obj = []
counter = 0

def insertion(obj):
    global counter
    global client_id
    global client_obj
    client_obj.insert(counter, obj)
    client_id.insert(counter, (obj+2)*2)
    counter = counter + 1
def delete(obj):
    global client_id
    global client_obj
    index = client_obj.index(obj)
    client_obj.remove(obj)
    del client_id[index]

insertion(52)
insertion(11)
insertion(12)


delete(52)
insertion(102)
try:
    delete(102)
except ValueError:
    print("neexistuje")
print(str(len(client_id)) + " " + str(len(client_obj)))
print(str(client_obj))