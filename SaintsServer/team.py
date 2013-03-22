from google.appengine.ext import db
import logging

package = 'SaintsSchedule'

class Team(db.Model):
    teamId = db.StringProperty()
    coach = db.StringProperty()
    school = db.StringProperty()
    grade = db.IntegerProperty()
    year = db.IntegerProperty()
    schedule = db.TextProperty()

    # schedule contains json like this below
    # {"games": [{"game_date": "4/1/2013", "time": "1:00 PM", "home": "St. J & A", "away": "ICD", location": "St. Joes"}]}

    def getGames(self, teamId):
		team = Team()
		games = ""
		q = db.Query(Team)
		q = Team.all()
		q.filter("teamId =", str(teamId))
		if q.count() > 0:
			team = q.get()
			games = str(team.schedule)
		return games
