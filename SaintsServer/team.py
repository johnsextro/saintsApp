from google.appengine.ext import db
import logging

package = 'SaintsSchedule'

class Team(db.Model):
	teamId = db.StringProperty()
	coach = db.StringProperty()
	school = db.StringProperty()
	grade = db.StringProperty()
	year = db.IntegerProperty()
	schedule = db.TextProperty()
	season= db.StringProperty()

	# schedule contains json like this below
	# {"games": [{"game_date": "4/1/2013", "time": "1:00 PM", "home": "St. J & A", "away": "ICD", location": "St. Joes"}]}

	def getGames(self, teamId):
		team = Team()
		games = ''
		q = db.Query(Team)
		q = Team.all()
		q.filter("teamId =", str(teamId))
		if q.count() > 0:
			team = q.get()
			games = str(team.schedule)
		return games


	def getCoaches(self, school=None, season=None):
		q = db.Query(Team, projection=('teamId', 'school', 'coach'))
		q = Team.all()
		if school is not None:
			q.filter("school =", school)
		if season is not None:
			q.filter("season =", season)
		q.order("school")
		q.order("coach")
		return q.run()

	def getSeasons(self):
		logging.info("Getting seasons from DB")
		q = db.Query(Team, projection=('season'), distinct=True)
		q = Team.all()
		return q.run()
			

	def getSchools(self, season=None):
		q = db.Query(Team, projection=('school'), distinct=True)
		q = Team.all()
		if season is not None:
			q.filter("season =", season)
		q.order("school")
		return q.run()