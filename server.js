const express = require('express');
const app = express();
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 8010;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://user:pass@ds123029.mlab.com:23029/db1');

const userSchema = new Schema({
	name: String,
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	admin: Boolean,
	created_at: Date,
	updated_at: Date
});

userSchema.methods.manify = function(next) {
	this.name = this.name + '-boy';
	return next(null, this.name);
};

userSchema.pre('save', function(next) {
	const currentDate = new Date();
	this.updated_at = currentDate;

	if (!this.created_at) {
		this.created_at = currentDate;
	}
	next();
});

const User = mongoose.model('User', userSchema);

const kenny = new User({
	name: 'Kenny',
	username: 'Kenny_the_boy',
	password: 'password'
});

kenny.manify(function(err, name) {
	if (err) throw err;
	console.log('Your new name is: ' + name);
});

const benny = new User({
	name: 'Benny',
	username: 'Benny_the_boy',
	password: 'password'
});

benny.manify(function(err, name) {
	if (err) throw err;
	console.log('Your new name is: ' + name);
});

const mark = new User({
	name: 'Mark',
	username: 'Mark_the_boy',
	password: 'password'
});

mark.manify(function(err, name) {
	if (err) throw err;
	console.log('Your new name is: ' + name);
});

const findAllUsers = function() {
	return User.find({}, function(err, res) {
		if (err) throw err;
		console.log('Actual database records are ' + res);
	});
}

const findSpecificRecord = function() {
	return User.find({ username: 'Kenny_the_boy' }, function(err, res) {
		if (err) throw err;
		console.log('Record you are looking for is ' + res);
	})
}

const updadeUserPassword = function() {
	return User.findOne({ username: 'Kenny_the_boy' })
	.then(function(user) {
		console.log('Old password is ' + user.password);
		console.log('Name ' + user.name);
		user.password = 'newPassword';
		console.log('New password is ' + user.password);
		return user.save(function(err) {
			if (err) throw err;
			console.log('Username ' + user.name + ' was successfully updated');
		})
	})
}

const updateUsername = function() {
	return User.findOneAndUpdate({ username: 'Benny_the_boy' }, { username: 'Benny_the_man' }, { new: true }, function(err, user) {
		if (err) throw err;
		console.log('Updated username is ' + user.username);
	})
}

const findMarkAndDelete = function() {
	return User.findOne({ username: 'Mark_the_boy' })
	.then(function(user) {
		return user.remove(function() {
			console.log('User successfully deleted');
		});
	})
}

const findKennyAndDelete = function() {
	return User.findOne({ username: 'Kenny_the_boy' })
	.then(function(user) {
		return user.remove(function() {
			console.log('User successfully deleted');
		});
	});
}

const findBennyAndRemove = function() {
	return User.findOneAndRemove({ username: 'Benny_the_man' })
	.then(function(user) {
		return user.remove(function() {
			console.log('User successfully deleted');
		});
	});
}

Promise.all([kenny.save(), mark.save(), benny.save()])
	.then(findAllUsers)
	.then(findSpecificRecord)
	.then(updadeUserPassword)
	.then(updateUsername)
	.then(findMarkAndDelete)
	.then(findKennyAndDelete)
	.then(findBennyAndRemove)
  .catch(console.log.bind(console))

app.use(express.static('./'));
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
