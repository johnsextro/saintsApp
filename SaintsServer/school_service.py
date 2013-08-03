from protorpc import messages
from protorpc import remote
from protorpc.wsgi import service
from team import Team
import logging

package = 'SaintsSchedule'

class School(messages.Message):
	school = messages.StringField(1, required=True)

class SchoolRequest(messages.Message):
    schoolRequest = messages.StringField(1, required=False)

# Create the response string
class SchoolResponse(messages.Message):
	schools = messages.MessageField(School, 1, repeated=True)

# Create the RPC service to exchange messages
class SchoolService(remote.Service):

 	@remote.method(SchoolRequest, SchoolResponse)
 	def school(self, request):
		t = Team()
		schools = []
		for team in t.getSchools():
			school = School(school=team.school)
			if school not in schools:
				schools.append(school)
		return SchoolResponse(schools=schools)

# Map the RPC service and path (/schedule)
app = service.service_mappings([('/school.*', SchoolService)])