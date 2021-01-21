#!/bin/env node

const child = require('child_process')
const fs = require('fs')
const path = require('path')

const version = process.argv[3]
const cwd = path.join(__dirname, '../')
child.execSync(['yarn lerna version', version, '--force-publish'], { cwd })

const templatePath = path.join(cwd, 'packages/create-redwood-app/template')

const updatePackageVersion = (p, version) => {
  const pkg = JSON.parse(fs.readFileSync(path.join(p, 'package.json'), 'utf-8'))

  for (const depName of pkg.dependencies.filter((x) =>
    x.startsWith('@redwoodjs/')
  )) {
    pkg.dependencies[depName] = version
  }

  for (const depName of pkg.devDependencies.filter((x) =>
    x.startsWith('@redwoodjs/')
  )) {
    pkg.dependencies[depName] = version
  }

  fs.writeFileSync(
    path.join(p, 'package.json'),
    JSON.stringify(pkg, undefined, 2)
  )
}

updatePackageVersion(path.join(templatePath, version))
updatePackageVersion(path.join(path.join(templatePath, 'api'), version))
updatePackageVersion(path.join(path.join(templatePath, 'web'), version))
