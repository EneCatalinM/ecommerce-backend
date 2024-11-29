import { Client } from '@elastic/elasticsearch';
import * as dotenv from 'dotenv';

dotenv.config();

const elasticsearchClient = new Client({
  node: process.env.ELASTICSEARCH_NODE,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
});

export default elasticsearchClient;
