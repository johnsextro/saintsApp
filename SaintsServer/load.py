import logging
import webapp2
from google.appengine.api import urlfetch
from lxml import etree
import team


class Load(webapp2.RequestHandler):
	def get(self):
		logging.info("Test cron job")
		url = urlfetch.fetch(url="http://www.cycstcharles.com/schedule.php?leagueid=1&season=32&conference=779&division=797&team=5766&pfv=y&sort=date&month=999&year=999", deadline=15)
		if url.status_code == 200:
			tree = etree.HTML(url.content)
			elements = tree.xpath('//table[@class="list"]//tr')
			self.saveTeamGames(elements)
			

	def saveTeamGames(self, games):
		t = team.Team()
		t.teamId = '1235'
		t.coach = 'Edmunds'
		t.school = 'SJC'
		t.year = 2013
		t.grade = 5
		t.schedule = self.jsonifyGames(games)
		t.put()

	def jsonifyGames(self, games):
		gamelist = []
		for rowindex in range(len(games)):
			if len(games[rowindex])>3 and games[rowindex][1].text is not None and games[rowindex][2].text is not None:
				game = '{"game_date": "%s", "time": "%s", "home": "%s", "away": "%s", "location": "%s"}' % (games[rowindex][1].text, games[rowindex][2].text, games[rowindex][4].text, games[rowindex][5].text, games[rowindex][3][0].text)
				# {"games": [{"game_date": "4/1/2013", "time": "1:00 PM", "home": "St. J & A", "away": "ICD", location": "St. Joes"}]}
				gamelist.append(game)
				logging.info("Date: " + games[rowindex][1].text + " Time: " + games[rowindex][2].text
					+ " Location: " + games[rowindex][3][0].text + 
					" Home: " + games[rowindex][4].text + 
					" Visitor: " + games[rowindex][5].text)
		return '{"games": [%s]}' % ", ".join(gamelist)

app = webapp2.WSGIApplication([('/crontask/scrape', Load)],debug=True)

if __name__ == '__main__':
	run_wsgi_app(application)



# http://www.cycstcharles.com/schedule.php?season=32&conference=779&division=-1&team=-1&month=3&year=2013&pfv=y&sort=date