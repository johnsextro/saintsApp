from google.appengine.ext import db

package = 'SaintsSchedule'

class Team(db.Model):
    teamId = db.StringProperty()
    coach = db.StringProperty()
    school = db.StringProperty()
    grade = db.IntegerProperty()
    year = db.IntegerProperty()
    schedule = db.StringProperty()

    def getGames(self, teamId):
    	g = ""
    	games = Team.all()
    	games.filter("teamId = ", teamId)
    	for r in games.run():
	    	g = r.schedule	
	    
	    return g
