from protorpc import messages
from protorpc import remote
from protorpc.wsgi import service

package = 'SaintsSchedule'

# Create the request string containing the user's name
class ScheduleRequest(messages.Message):
    my_name = messages.StringField(1, required=True)

# Create the response string
class ScheduleResponse(messages.Message):
    hello = messages.StringField(1, required=True)

# Create the RPC service to exchange messages
class ScheduleService(remote.Service):

    @remote.method(ScheduleRequest, ScheduleResponse)
    def schedule(self, request):
        return ScheduleResponse(hello='Hello there, %s!' % request.my_name)

# Map the RPC service and path (/hello)
app = service.service_mappings([('/schedule.*', ScheduleService)])