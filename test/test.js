var supertest = require("supertest");

var server = supertest.agent("http://localhost:3000");

describe("Json server response test", function() {
  it("should give response 200", function(done) {
    server
      .get("/items")
      .expect("Content-type", /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
