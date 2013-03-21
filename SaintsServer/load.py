import logging
import webapp2
from google.appengine.api import urlfetch
from lxml import etree



class Load(webapp2.RequestHandler):
	def get(self):
		logging.info("Test cron job")
		url = urlfetch.fetch(url="http://www.cycstcharles.com/schedule.php?leagueid=1&season=32&conference=779&division=797&team=5766&pfv=y&sort=date&month=999&year=999", deadline=15)
		if url.status_code == 200:
			tree = etree.HTML(url.content)
			elements = tree.xpath('//table[@class="list"]//tr')
			for rowindex in range(len(elements)):
				if len(elements[rowindex])>3 and elements[rowindex][1].text is not None and elements[rowindex][2].text is not None:
					logging.info("Date: " + elements[rowindex][1].text + " Time: " + elements[rowindex][2].text
						+ " Location: " + elements[rowindex][3][0].text + 
						" Home: " + elements[rowindex][4].text + 
						" Visitor: " + elements[rowindex][5].text)


app = webapp2.WSGIApplication([('/crontask/scrape', Load)],debug=True)

if __name__ == '__main__':
	run_wsgi_app(application)



# http://www.cycstcharles.com/schedule.php?season=32&conference=779&division=-1&team=-1&month=3&year=2013&pfv=y&sort=date