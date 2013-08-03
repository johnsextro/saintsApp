import logging
import webapp2
from google.appengine.api import urlfetch
from lxml import etree
import team
import time

class Load(webapp2.RequestHandler):
	GAME_DATE = 1
	GAME_TIME = 2
	LOCATION = 3
	HOME_TEAM = 4
	AWAY_TEAM = 5

	def get(self):
		start_time = time.time()
		logging.info("Beginning data load")
		teamIds = self.get_team_ids()
		stcharlesurl = "http://www.cycstcharles.com/schedule.php?team=%s&pfv=y&sort=date&month=999&year=999"
		for team_id in teamIds:
			team_url = stcharlesurl % team_id[1]
			self.fetch_team_schedule(team_url, team_id)
		logging.info("Finished loading the schedule data. Elapsed time (in mins): " + str((time.time() - start_time)/60))



	def fetch_team_schedule(self, team_url, team_id):
		url = urlfetch.fetch(url=team_url, deadline=99)
		if url.status_code == 200:
			tree = etree.HTML(url.content)
			# logging.info(url.content)
			elements = tree.xpath('//table[@class="list"]//tr')
			# logging.info(str(season[0].text.strip())
			self.save_team_games(elements, team_id[1], team_id[0], self.get_season(tree), self.get_grade(tree))


	def get_grade(self, tree):
		grade = ''
		gradeElement = tree.xpath('//table[@class="list"]//tr/td[@class="smalltext"][7]/select[@class="smalltext"]//option[@selected = "selected"]/../@label')
		if (len(gradeElement) == 1):
			grade = gradeElement[0].strip()
		return grade	

	def get_season(self, tree):
		season = ''
		seasonElement = tree.xpath('//table/tr/td[1]/select//option[@selected = "selected"]')
		if (len(seasonElement) == 1):
			season = seasonElement[0].text.strip()
		return season


	def get_team_ids(self):
		teams = []
		url = urlfetch.fetch(url="http://www.cycstcharles.com/schedule.php?team=0", deadline=99)
		if url.status_code == 200:
			tree = etree.HTML(url.content)
			elements = tree.xpath('//td[@class="smalltext"][7]/select[@class="smalltext"]//option')
			for team_name in elements:
				attribs = team_name.attrib
				value = attribs["value"]
				teams.append([team_name.text.strip(),value[value.find("&team=")+6:]])
		return teams


	def save_team_games(self, games, team_id, coach, season, grade):
		# todo: Need to account for teams that already exist in the database
		t = team.Team(key_name=str(team_id))
		t.teamId = str(team_id)
		t.coach = coach[coach.find('-'):]
		t.coach = t.coach.strip()
		t.season = season
		t.grade = grade
		endIndex = 1
		if (coach.find("-") > 1):
			endIndex = coach.find("-")
			school = coach[:endIndex]
			t.school = school.strip()
		t.year = 2013
		t.schedule = self.jsonify_games(games)
		if t.school is not None:
			t.put()


	def jsonify_games(self, games):
		gamelist = []
		for rowindex in range(len(games)):
			if len(games[rowindex])>3 and games[rowindex][1].text is not None and games[rowindex][2].text is not None:
				gameId = hash(games[rowindex][self.GAME_DATE].text + games[rowindex][self.GAME_TIME].text + games[rowindex][self.HOME_TEAM].text + games[rowindex][self.AWAY_TEAM].text + games[rowindex][self.LOCATION][0].text)
				game = '{"game_date": "%s", "time": "%s", "home": "%s", "away": "%s", "location": "%s", "id": "%s"}' % (games[rowindex][self.GAME_DATE].text, games[rowindex][self.GAME_TIME].text, games[rowindex][self.HOME_TEAM].text, games[rowindex][self.AWAY_TEAM].text, games[rowindex][self.LOCATION][0].text, gameId)
				# {"games": [{"game_date": "4/1/2013", "time": "1:00 PM", "home": "St. J & A", "away": "ICD", location": "St. Joes"}]}
				gamelist.append(game)
		return '{"games": [%s]}' % ", ".join(gamelist)

app = webapp2.WSGIApplication([('/crontask/scrape', Load)],debug=True)

if __name__ == '__main__':
	run_wsgi_app(application)



# http://www.cycstcharles.com/schedule.php?season=32&conference=779&division=-1&team=-1&month=3&year=2013&pfv=y&sort=date