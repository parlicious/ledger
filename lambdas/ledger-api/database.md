
# Thoughts on our 'Database'


 Will have two types data being written to s3:
  - data
  - views
  
 Data is the analog to single rows in a relational DB though highly denormalized here
 Views are saved queries or aggregates of the data. They're essentially cached queries,
 but of two types:
  - views that can be updated only with themselves and the new piece of data
      - simple example here is getting top 10 wagers by size, if the new data
        is greater than any of the values in the current query, that view is updated
  - views that need the entire data set to be updated.
      - things like statistical values might go here, not sure. I think most typical queries
        will fit the former.
        
 First pass at this will probably be handling this all ad-hoc and manually. Eventually it would be
 cool to define queries both in terms of the function `(all data) => result` and in terms of
 `(old result, new data) => result`. Once you have this, it's easy enough to do the actual query if the
 old result doesn't exist, otherwise just update the current one. The app will know what data each query
 is dependent on, so it should be possible to create the entire list of queries that need to be updated.
 I guess this will be a `listObjects` on the saved queries folder in S3 for every update? Could also just
 have some sort of metaobject with a list of all the current saved queries. 
 
 
 The library I'm thinking of should probably not be tied to S3 if I ever want this to be able to run on GCP. We can
 just assume object names with the ability to prefix with paths and saving json.
 