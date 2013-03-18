from google.appengine.ext import db
import logging

package = 'SaintsSchedule'

class Team(db.Model):
    teamId = db.StringProperty()
    coach = db.StringProperty()
    school = db.StringProperty()
    grade = db.IntegerProperty()
    year = db.IntegerProperty()
    schedule = db.StringProperty()

    def getGames(self, teamId):
		team = Team()
		games = ""
		q = db.Query(Team)
		q = Team.all()
		for team in q.run():
			games = team.schedule
		return games
