import logging
import webapp2
from google.appengine.api import urlfetch



class Load(webapp2.RequestHandler):
	def get(self):
		logging.info("Test cron job")
		result = urlfetch.fetch(url="http://www.cycstcharles.com/schedule.php?season=32&conference=779&division=-1&team=-1&month=3&year=2013&pfv=y&sort=date")
		if result.status_code == 200:
			logging.info("valid response")

app = webapp2.WSGIApplication([('/crontask/scrape', Load)],debug=True)

if __name__ == '__main__':
	run_wsgi_app(application)



# http://www.cycstcharles.com/schedule.php?season=32&conference=779&division=-1&team=-1&month=3&year=2013&pfv=y&sort=date