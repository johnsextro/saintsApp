import logging
import webapp2


class Load(webapp2.RequestHandler):
	def get(self):
		logging.info("Test cron job")

app = webapp2.WSGIApplication([('/crontask/scrape', Load)],debug=True)

if __name__ == '__main__':
	run_wsgi_app(application)