from protorpc import messages
from protorpc import remote
from protorpc.wsgi import service
from team import Team
import logging

package = 'SaintsSchedule'

class Games(messages.Message):
	game = messages.StringField(1, required=True)

class GamesRequest(messages.Message):
    team_id = messages.StringField(1, required=True)

# Create the response string
class GamesResponse(messages.Message):
    games = messages.MessageField(Games, 1, repeated=True)

# Create the RPC service to exchange messages
class GamesService(remote.Service):

    @remote.method(GamesRequest, GamesResponse)
    def games(self, request):
		t = Team()
		responseArray = []
		schedule = t.getGames(request.team_id)
		trimmedSchedule = schedule[10:len(schedule)-1]
		gamesArray = eval(trimmedSchedule)
		logging.info(gamesArray)
		for game in gamesArray:
			responseGame = Games(game=unicode(game))
			responseArray.append(responseGame)
		return GamesResponse(games=responseArray)

# Map the RPC service and path (/schedule)
app = service.service_mappings([('/games.*', GamesService)])