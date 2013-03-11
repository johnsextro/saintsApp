from protorpc import messages
from protorpc import remote
from protorpc.wsgi import service

package = 'SaintsSchedule'

# Create the request string containing the user's name
class ScheduleRequest(messages.Message):
    team_id = messages.StringField(1, required=True)

# Create the response string
class ScheduleResponse(messages.Message):
    game_date = messages.StringField(1, required=True)
    opponent = messages.StringField(2, required=True)
    location = messages.StringField(3, required=True)

# Create the RPC service to exchange messages
class ScheduleService(remote.Service):

    @remote.method(ScheduleRequest, ScheduleResponse)
    def schedule(self, request):
        return ScheduleResponse(game_date="4/1/2013", opponent="St. J & A", location="St. Joe")

# Map the RPC service and path (/hello)
app = service.service_mappings([('/schedule.*', ScheduleService)])