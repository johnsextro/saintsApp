import logging
import webapp2
from google.appengine.api import urlfetch
from lxml import etree



class Load(webapp2.RequestHandler):
	def get(self):
		logging.info("Test cron job")
		url = urlfetch.fetch(url="http://www.cycstcharles.com/schedule.php?season=32&conference=779&division=-1&team=-1&month=3&year=2013&pfv=y&sort=date")
		if url.status_code == 200:
			tree = etree.HTML(url.content)
			result = etree.tostring(tree, pretty_print=True, method="html")
			elements = tree.xpath('//table[@class="list"]//tr')
			logging.info(str(len(elements)))

app = webapp2.WSGIApplication([('/crontask/scrape', Load)],debug=True)

if __name__ == '__main__':
	run_wsgi_app(application)



# http://www.cycstcharles.com/schedule.php?season=32&conference=779&division=-1&team=-1&month=3&year=2013&pfv=y&sort=date