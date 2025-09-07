#!/usr/bin/env node

const deepStrictEqual = require('assert').deepStrictEqual

const linuxCmdline = require('.')


const cmdline = 'initrd=\\init-lin.img root=UUID=uuid someflag a.b=c d.e f=g,h'
const expected =
{
  initrd: '\\init-lin.img',
  root: 'UUID=uuid',
  someflag: true,
  a: { b: 'c' },
  d: { e: true },
  f: [ 'g', 'h' ]
}

var result = linuxCmdline(cmdline)

deepStrictEqual(result, expected)
