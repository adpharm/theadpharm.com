from ninja import NinjaAPI

api = NinjaAPI(csrf=True)

# You can add a router as an object
api.add_router("/users/", "users.api.router")
api.add_router("/plinko/", "plinko.api.router")
