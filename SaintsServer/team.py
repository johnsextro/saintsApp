from google.appengine.ext import db

package = 'SaintsSchedule'

class Team(db.Model):
    teamId = db.StringProperty(required=True)
    coach = db.StringProperty(required=True)
    school = db.StringProperty(required=True)
    grade = db.IntegerProperty(required=True)
    year = db.IntegerProperty(required=True)
    schedule = db.StringProperty(required=True)