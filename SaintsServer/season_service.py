from protorpc import messages
from protorpc import remote
from protorpc.wsgi import service
from team import Team
import logging

package = 'SaintsSchedule'

class Season(messages.Message):
	season = messages.StringField(1, required=True)

class SeasonRequest(messages.Message):
    seasonRequest = messages.StringField(1, required=False)

# Create the response string
class SeasonResponse(messages.Message):
    seasons = messages.MessageField(Season, 1, repeated=True)

# Create the RPC service to exchange messages
class SeasonService(remote.Service):

    @remote.method(SeasonRequest, SeasonResponse)
    def season(self, request):
		t = Team()
		seasons = []
		logging.info("1000")
		for team in t.getSeasons():
			season = Season(season=team.season)
			if season not in seasons:
				seasons.append(season)
		#logging.info("seasons = " + seasons.str())
		return SeasonResponse(seasons=seasons)

# Map the RPC service and path (/schedule)
app = service.service_mappings([('/season.*', SeasonService)])