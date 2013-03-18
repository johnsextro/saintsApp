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
		q.filter("teamId =", str(teamId))
		if q.count() > 0:
			team = q.get()
			games = team.schedule
		return games
