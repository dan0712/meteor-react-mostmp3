import { Mongo } from 'meteor/mongo';

export const Recentsongs  = new Mongo.Collection('recentsongs');

export const Popularsongs  = new Mongo.Collection('popularsongs');