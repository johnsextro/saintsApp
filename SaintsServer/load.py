import logging
import webapp2
from google.appengine.api import urlfetch
from google.appengine.api import memcache
from lxml import etree
import team
import time
from season_service import Season
from team import Team

class Load(webapp2.RequestHandler):
	GAME_ID = 0
	GAME_DATE = 1
	GAME_TIME = 2
	LOCATION = 3
	HOME_TEAM = 4
	AWAY_TEAM = 5
	SCORE = 6
	schoolNames = ["ICOM", "2Rivers", "A.S.H.", "AS", "ASH", "All Saints", "Assumption", "Borromeo", "HS", "HT", "Holy Rosary", "Holy Spirit", "Holy Trinity", "ICD", "ICOM", "IHM", "J and A", "JA", "JandA", "LWCS", "Living Word", "S.H. Troy", "SC", "SESR", "SESR Carrie Mejia", "SH T", "SH Troy", "SJ", "SJ Cott", "Sacred Heart Troy", "St Cletus", "St Joe", "St Joe Cottleville", "St Josephville", "St Patrick", "St Paul", "St Peter", "St Peters", "St Theodore", "St. Cletus", "St. Ignatius", "St. Joe", "St. Joe Cottleville", "St. Joe Cott", "St. Joe Josephsville", "St. Patrick", "St. Paul", "St. Peter", "St. Rose", "St. Sabina", "St. Theo", "St. Theodore", "St.Joe Cottleville", "St.Patrick", "Sts J and A", "Sts JandA", "Sts. J and A", "Sts. J andA", "Sts. JandA", "St Joseph", "St. Joseph"]
	
	def get(self):
		start_time = time.time()
		logging.info("Beginning data load")
		# teamIds = self.get_soccer_team_ids()
		# stcharlesurl = "http://www.cycstcharles.com/schedule.php?team=%s&pfv=y&sort=date&month=999&year=999&season=43"
		# for team_id in teamIds:
		# 	team_url = stcharlesurl % team_id[1]
		# 	self.fetch_team_schedule(team_url, team_id)
		# logging.info("Finished loading the soccer schedule data. Elapsed time (in mins): " + str((time.time() - start_time)/60))
		# teamIds = self.get_baseball_softball_team_ids()
		# stcharlesurl = "http://www.cycstcharles.com/schedule.php?team=%s&pfv=y&sort=date&month=999&year=999&season=47"
		# for team_id in teamIds:
		# 	team_url = stcharlesurl % team_id[1]
		# 	self.fetch_team_schedule(team_url, team_id)
		# logging.info("Finished loading the softball/baseball schedule data. Elapsed time (in mins): " + str((time.time() - start_time)/60))
		# teamIds = self.get_soccer_team_ids()
		# stcharlesurl = "http://www.cycstcharles.com/schedule.php?team=%s&pfv=y&sort=date&month=999&year=999&season=39"
		# for team_id in teamIds:
		# 	team_url = stcharlesurl % team_id[1]
		# 	self.fetch_team_schedule(team_url, team_id)
		# logging.info("Finished loading the soccer schedule data. Elapsed time (in mins): " + str((time.time() - start_time)/60))
		# teamIds = self.get_volleyball_team_ids()
		# stcharlesurl = "http://www.cycstcharles.com/schedule.php?team=%s&pfv=y&sort=date&month=999&year=999&season=44"
		# for team_id in teamIds:
		# 	team_url = stcharlesurl % team_id[1]
		# 	self.fetch_team_schedule(team_url, team_id)
		# logging.info("Finished loading the volleyball schedule data. Elapsed time (in mins): " + str((time.time() - start_time)/60))
		if memcache.flush_all():
			logging.info("Flushed everything from memcache.")
		else:
			logging.error("Error trying to flush the memcache.")

		t = Team()
		seasons = []
		for team in t.getSeasons():
			season = Season(season=team.season)
			if season not in seasons:
				seasons.append(season)
		if not memcache.add('seasons', seasons):
			logging.error('memcache failed to set')

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

	def get_baseball_softball_team_ids(self):
		teams = []
		url = urlfetch.fetch(url="http://www.cycstcharles.com/schedule.php?month=999&year=2015&pfv=n&location=-1&leagueid=1&season=47&conference=-1&division=-1&team=-1", deadline=99)
		if url.status_code == 200:
			tree = etree.HTML(url.content)
			elements = tree.xpath('//td[@class="smalltext"][7]/select[@class="smalltext"]//option')
			for team_name in elements:
				attribs = team_name.attrib
				value = attribs["value"]
				teams.append([team_name.text.strip(),value[value.find("&team=")+6:]])
		return teams

	def get_basketball_team_ids(self):
		teams = []
		url = urlfetch.fetch(url="http://www.cycstcharles.com/schedule.php?month=999&year=999&pfv=n&location=-1&leagueid=1&season=45&conference=-1&division=-1&team=-1", deadline=99)
		if url.status_code == 200:
			tree = etree.HTML(url.content)
			# elements = tree.xpath('//*[@id="maincontent"]/table[2]/tbody/tr/td[2]/div[3]/table/tbody/tr[3]/td/table/tbody/tr/td[7]//option')
			elements = tree.xpath('//td[@class="smalltext"][7]/select[@class="smalltext"]//option')
			logging.info(elements)
			for team_name in elements:
				attribs = team_name.attrib
				logging.info(attribs)
				value = attribs["value"]
				logging.info(value)
				logging.info([team_name.text.strip(),value[value.find("&team=")+6:]])
				teams.append([team_name.text.strip(),value[value.find("&team=")+6:]])
		return teams

	def get_soccer_team_ids(self):
		teams = []
		url = urlfetch.fetch(url="http://www.cycstcharles.com/schedule.php?month=999&year=2015&pfv=n&location=-1&leagueid=1&season=43&conference=-1&division=-1&team=-1", deadline=99)
		if url.status_code == 200:
			tree = etree.HTML(url.content)
			elements = tree.xpath('//td[@class="smalltext"][7]/select[@class="smalltext"]//option')
			for team_name in elements:
				attribs = team_name.attrib
				value = attribs["value"]
				teams.append([team_name.text.strip(),value[value.find("&team=")+6:]])
		return teams

	def get_volleyball_team_ids(self):
		teams = []
		url = urlfetch.fetch(url="http://www.cycstcharles.com/schedule.php?month=999&year=2015&pfv=n&location=-1&leagueid=1&season=44&conference=-1&division=-1&team=-1", deadline=99)
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
		for val in self.schoolNames:
			if coach.find(val) > -1:
				t.school = val
				coach = coach[len(val)+1:]
				coach = coach.strip()
				t.coach = coach
				logging.info("School = " + t.school)
				logging.info("Coach = " + t.coach)
				t.season = season
				t.grade = grade
				t.year = 2014
				logging.debug(self.jsonify_games(games))
				t.schedule = self.jsonify_games(games)
				if t.school is not None and t.grade is not None:
					t.put()
				break

	def jsonify_games(self, games):
		gamelist = []
		for rowindex in range(len(games)):
			if len(games[rowindex])>3 and games[rowindex][1].text is not None and games[rowindex][2].text is not None:
				try:
					game = '{"game_date": "%s", "time": "%s", "home": "%s", "away": "%s", "location": "%s", "id": "%s", "score": "%s"}' % (games[rowindex][self.GAME_DATE].text, games[rowindex][self.GAME_TIME].text, games[rowindex][self.HOME_TEAM].text, games[rowindex][self.AWAY_TEAM].text, games[rowindex][self.LOCATION][0].text, games[rowindex][self.GAME_ID].text, games[rowindex][self.SCORE].text)
					# {"games": [{"game_date": "4/1/2013", "time": "1:00 PM", "home": "St. J & A", "away": "ICD", location": "St. Joes"}]}
					gamelist.append(game)
				except IndexError, e:
					logging.debug(e)
					logging.debug(games[rowindex])
					continue
		return '{"games": [%s]}' % ", ".join(gamelist)

app = webapp2.WSGIApplication([('/crontask/scrape', Load)],debug=True)

if __name__ == '__main__':
	run_wsgi_app(application)



# http://www.cycstcharles.com/schedule.php?season=32&conference=779&division=-1&team=-1&month=3&year=2013&pfv=y&sort=date