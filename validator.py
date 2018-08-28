from jsonschema import validate, ValidationError
from flask import jsonify

schema_post_suspect = {"type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "gender": {
      "type": "string"
    }
  },
  "required": [
    "name",
    "gender"
  ]
}

def request_to_string(request):
    return "".join(map(chr, request.get_data()))

def validate_request(request, schema):
    try:
        validate(request, schema)
        return True
    except ValidationError:
        return  False

class InvalidUsage(Exception):

    def __init__(self, msg, status_code, playload=None):
        Exception.__init__(self)
        self.msg = msg
        self.status_code = status_code
        self.playload = playload

    def to_dict(self):
        rv = dict(self.playload or ())
        rv["message"] = self.msg
        return rv
