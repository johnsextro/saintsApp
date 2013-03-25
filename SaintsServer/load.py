import logging
import webapp2
from google.appengine.api import urlfetch
from lxml import etree
import team
import time

class Load(webapp2.RequestHandler):
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
			elements = tree.xpath('//table[@class="list"]//tr')
			self.save_team_games(elements, team_id[1], team_id[0])


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


	def save_team_games(self, games, team_id, coach):
		# todo: Need to account for teams that already exist in the database
		t = team.Team(key_name=str(team_id))
		t.teamId = str(team_id)
		t.coach = coach
		endIndex = 1
		if (coach.find("-") > 1):
			endIndex = coach.find("-")
			t.school = coach[:endIndex]
		t.year = 2013
		t.schedule = self.jsonify_games(games)
		t.put()


	def jsonify_games(self, games):
		gamelist = []
		for rowindex in range(len(games)):
			if len(games[rowindex])>3 and games[rowindex][1].text is not None and games[rowindex][2].text is not None:
				game = '{"game_date": "%s", "time": "%s", "home": "%s", "away": "%s", "location": "%s"}' % (games[rowindex][1].text, games[rowindex][2].text, games[rowindex][4].text, games[rowindex][5].text, games[rowindex][3][0].text)
				# {"games": [{"game_date": "4/1/2013", "time": "1:00 PM", "home": "St. J & A", "away": "ICD", location": "St. Joes"}]}
				gamelist.append(game)
		return '{"games": [%s]}' % ", ".join(gamelist)

app = webapp2.WSGIApplication([('/crontask/scrape', Load)],debug=True)

if __name__ == '__main__':
	run_wsgi_app(application)



# http://www.cycstcharles.com/schedule.php?season=32&conference=779&division=-1&team=-1&month=3&year=2013&pfv=y&sort=date