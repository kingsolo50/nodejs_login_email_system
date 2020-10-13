const mocha = require('mocha');
const { db } = require('../models/localUser');
const assert = require('chai').assert;
const expect = require('chai').expect;
const localUser = require('../models/localUser');
const registerApi = require('../routes/userRegistration');


  describe('User', function () {

    describe('#save()', function () {
      //1
      it('should save without error', function () {
        var user = new localUser({
          email: 'email@hotmail.com',
          password: 'password',
          username: 'username', 
          pin: 1234,       
          firstName: 'solo',
          lastName: 'mon',
          postCode: 'e12 6aq',
          contactNumber: '07949849131'
        });
        user.save(function (done, err) {
          if (err) done(err);
          else done();
        });
      });
    });

    //2
    it('returns a user object')

    //3
    it('creates hash password')

    //4
    it('throws an error when the user already exist')

    //5
    it('send newly registered user validation email')

  });
  
  // const user = new localUser({
  //   password: 'password',
  //   username: 'username', 
  //   pin: 1234,       
  //   firstName: 'solo',
  //   lastName: 'mon',
  //   postCode: 'e12 6aq',
  //   contactNumber: '07949849131'
  // });

 

  

