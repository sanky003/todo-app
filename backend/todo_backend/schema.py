import graphene
from todos.schema import Query, Mutation

schema = graphene.Schema(query=Query, mutation=Mutation)
