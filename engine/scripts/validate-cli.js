#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { validateShacl } from '../dist/index.js';

const {
  values: { data, shapes }
} = parseArgs({
  options: {
    data: { type: 'string' },
    shapes: { type: 'string' }
  }
});

if (!data || !shapes) {
  console.error('Usage: pnpm validate --data <data.ttl> --shapes <shapes.ttl>');
  process.exit(1);
}

const dataTurtle = readFileSync(data, 'utf8');
const shapesTurtle = readFileSync(shapes, 'utf8');
const result = await validateShacl(dataTurtle, shapesTurtle);
console.log(result.reportGraphTurtle);
