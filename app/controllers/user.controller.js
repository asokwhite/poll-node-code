const db = require("../models");
var fs = require('fs');
const User = db.user;
const Voter = db.voter;
var async = require("async");
var pdf = require('html-pdf');
var path = require('path');

const { io } = require('../../server');

exports.result = async (req, res) => {
  var candidates = await User.findAll({where: {role:2}});
  var result = [];
  for(let item of candidates){
  	var count = await Voter.count({where: {candidate_id:item.id}});
  	var insert = {};
  	insert.name = item.firstName+' '+item.lastName;
  	insert.y = count;
  	result.push(insert);
  }
  res.status(200).send({apiStatus: true,result:result});
};

exports.exportPdf = async (req, res) => {
	var votedetails = await Voter.findAll({});
	var info = '';
	for(let item of votedetails){
		var user = await User.findOne({where:{id:item.candidate_id}});
		var insert = ` <tr>
			    <td>`+item.voter_email+`</td>
			    <td>`+user.firstName+` `+user.lastName+`</td>
			  </tr>`;
		info += insert;
	}
	var html = await fs.readFileSync('./Template.html', 'utf8');
	html = html.replace("#value#", info);
	var options = { format: 'Letter' };
	
	 //res.sendFile('./../../Download/businesscard.pdf', { root: __dirname });
	 pdf.create(html, options).toFile('./Download/businesscard.pdf', function(err, result) {
	   if (err) return console.log(err);
	   //console.log(result); // { filename: '/app/businesscard.pdf' }
	  	res.sendFile(path.resolve('./Download/businesscard.pdf'));
	 });
};

exports.candidate = (req, res) => {
	User.findAll({
	    attributes: ['id','firstName','lastName'],
		where: {
		role: 2
		}
	})
	.then(user => {
		res.status(200).send(user);
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
};

exports.emailcheck = (req, res) => {
	Voter.findOne({
		where: {
		voter_email: req.body.email
		}
	})
	.then(user => {
		if(user){
			res.status(200).send({apiStatus: false,message: "User email is already Voted"});
		}
		else{
			res.status(200).send({apiStatus: true,message: "New User! Ready to vote"});
		}
		
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
};

exports.vote = (req, res) => {
	Voter.findOne({
		voter_email: req.body.email

	})
	.then(user => {
		io.sockets.emit('updateVotes');
		if(user)
			res.send({ apiStatus: false,message: "User email is already Voted" });
		else
			return Voter.create({voter_email: req.body.email,candidate_id: req.body.candidate_id});
	})
	.then(result => {
		if(result)
			res.status(200).send({apiStatus: true,message: "Thanks for voted!"});

	})
	.catch(err => {
		res.status(500).send({ message: err.message });
	});
};

