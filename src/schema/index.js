const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType
} = require( 'graphql' )

// 我们要用的模拟数据
const movies = require( '../../movies_file.json' )

const Movie = new GraphQLObjectType( {
  name: 'Movie',
  description: 'Movie 领域模型',
  fields: {
    _id: {
      type: GraphQLID
    },
    id: {
      type: GraphQLString
    },
    title: {
      type: GraphQLString
    },
    link: {
      type: GraphQLString
    },
    poster: {
      type: GraphQLString
    },
    synopsis: {
      type: GraphQLString
    },
    metascore: {
      type: GraphQLString
    },
    rating: {
      type: GraphQLInt
    },
    votes: {
      type: GraphQLInt
    },
    year: {
      type: GraphQLInt
    },
    date: {
      type: GraphQLString
    },
    review: {
      type: GraphQLInt
    }
  }
} );

const inputType = new GraphQLInputObjectType( {
  name: 'input',
  fields: () => ( {
    id: {
      type: GraphQLString
    },
    date: {
      type: GraphQLString
    },
    review: {
      type: GraphQLInt
    }
  } )
} );

const Query = new GraphQLObjectType( {
  name: 'Query',
  fields: {
    movieDetail: {
      type: Movie,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve: function ( _, args ) {
        return global.collection.findOne( {
          "id": args.id
        } )
      }
    },
    movieLists: {
      type: new GraphQLList( Movie ),
      args: {},
      resolve: function ( _, args ) {
        return global.collection.find( {} ).toArray();
      }
    },
    movieFilter: {
      type: new GraphQLList( Movie ),
      args: {
        limit: {
          type: GraphQLInt
        },
        metascore: {
          type: GraphQLInt
        }
      },
      resolve: function ( _, args ) {
        let limit = args.limit;
        if ( limit == null ) limit = 5;
        let metascore = args.metascore;
        if ( metascore == null ) metascore = 0;

        let query = {
          metascore: {
            $gte: parseInt( metascore )
          }
        };

        return global.collection.find( query ).limit( parseInt( limit ) ).toArray();
      }
    }
  }
} );

const Mutation = new GraphQLObjectType( {
  name: 'Mutation',
  fields: {
    movieEdit: {
      type: Movie,
      args: {
        data: {
          type: inputType
        }
      },
      resolve: async function ( _, args ) {
        var date = args.data.date;
        var review = args.data.review;
        var query = {
          "id": args.data.id
        };

        await global.collection.updateOne( query, {
          $set: {
            date: date,
            review: review
          }
        } );

        return global.collection.findOne( {
          "id": args.id
        } )
      }
    }
  }
} );


const Schema = new GraphQLSchema( {
  query: Query,
  mutation: Mutation
} );

module.exports = Schema;
