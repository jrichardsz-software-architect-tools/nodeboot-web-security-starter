var chai = require('chai');
var path = require('path');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;
const UserMemoryProvider = require("../../src/user/UserMemoryProvider.js");

describe('user/UserMemoryProvider.js \tfindUser()', function() {
  it('findUserForDefaultLogin: without env vars', function() {
    // process.env['USER_jane'] = undefined;
    var userMemoryProvider = new UserMemoryProvider({
      envKey: "USER_"
    });
    var jane = userMemoryProvider.findUserForDefaultLogin("jane");
    expect(undefined).to.equal(jane);
  });
  it('findUserForDefaultLogin: simpe user = pssword', function() {
    process.env['USER_jane'] = "changeme";
    process.env['USER_kurt'] = "secret";
    var userMemoryProvider = new UserMemoryProvider({
      envKey: "USER_"
    });
    var jane = userMemoryProvider.findUserForDefaultLogin("jane");
    expect("changeme").to.equal(jane.password);
    var kurt = userMemoryProvider.findUserForDefaultLogin("kurt");
    expect("secret").to.equal(kurt.password);
  });
  it('isUserAllowedForOauth2Login: without env var', function() {
    var userMemoryProvider = new UserMemoryProvider({
      envKey: "SELF_SERVICE_DOCS_ALLOWED_USERS"
    });
    expect(userMemoryProvider.isUserAllowedForOauth2Login("cooper@mail.com")).to.equal(false);
    expect(userMemoryProvider.isUserAllowedForOauth2Login("jane@mail.com")).to.equal(false);
    expect(userMemoryProvider.isUserAllowedForOauth2Login("kurt@blindspot.com")).to.equal(false);
  });
  it('isUserAllowedForOauth2Login: with env var', function() {
    process.env['SELF_SERVICE_DOCS_ALLOWED_USERS'] = "jane@mail.com, kurt@blindspot.com";
    var userMemoryProvider = new UserMemoryProvider({
      envKey: "SELF_SERVICE_DOCS_ALLOWED_USERS"
    });
    expect(userMemoryProvider.isUserAllowedForOauth2Login("cooper@mail.com")).to.equal(false);
    expect(userMemoryProvider.isUserAllowedForOauth2Login("jane@mail.com")).to.equal(true);
    expect(userMemoryProvider.isUserAllowedForOauth2Login("kurt@blindspot.com")).to.equal(true);
  });
});
