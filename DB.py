
suspect = [{"suspect_id": 1, "name": "Vasya", "gender":"male"},
           {"suspect_id": 2, "name": "Katya", "gender": "female"},
           {"suspect_id": 3, "name": "Mursik", "gender": "not sure"}]

code = [{"code": "no code"}, {"code": "no code"}, {"code": "sherlock"}, {"code" :"no code"}]

suspect_id = 4

def add_to_DB(name, gender):
    item = {"suspect_id": suspect_id, "name": name, "gender": gender}
    suspect.append(item)
    if len(suspect) > suspect_id:
        del suspect[suspect_id - 1]
