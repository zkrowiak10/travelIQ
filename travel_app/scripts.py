
from travel_app import models

user = models.db.session.query(models.User).first()
trip = models.Trip("Trip to Italy", "10-20-2021","10-30-2021", "A beautiful place")
pairing = models.UserTripPair(trip=trip, user=user,admin = True)
trip.userPairings.append(pairing)
models.db.session.add(trip)
models.db.session.commit()
