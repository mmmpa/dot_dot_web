gulp = require 'gulp'

browserify = require 'browserify'
sass = require 'gulp-sass'
watch = require 'gulp-watch'

minify = require 'gulp-minify-css'
plumber = require 'gulp-plumber'
uglify = require 'gulp-uglify'
gzip = require 'gulp-gzip'
source = require 'vinyl-source-stream'
streamify = require 'gulp-streamify'
rename = require 'gulp-rename'
notify = require 'gulp-notify'
path = require 'path'
_ = require 'lodash'
shell = require 'gulp-shell'

rootPath = path.join(__dirname, '../')
srcRootPath = path.join(__dirname, './')
publicJsPath = path.join(rootPath, './public/js')
publicCSSPath = path.join(rootPath, './public/css')
sassWatch = path.join(srcRootPath, 'sass/**/*.sass')

onError = (err)->
  console.log(err.toString())
  @emit("end")

gulp.task 'default', ->

  split = (filePath)->
    _(path.relative(rootPath, filePath).split('/')).drop(3).dropRight(1).value()

  genPath = (dirs, filePath)->
    dirs.concat(split(filePath)).join('/')

  gulp.watch(sassWatch).on 'change', (e) ->
    dest = genPath(['public', 'css'], e.path)

    gulp
    .src e.path
    .pipe plumber()
    .pipe sass(compass: true)
    .pipe minify(keepBreaks: false)
    .pipe gulp.dest(path.join(rootPath, dest))

  gulp.watch('./ts_built/built.js').on 'change', (e) ->
    gulp
    .src e.path
    .pipe rename('common.js')
    .pipe gulp.dest(publicJsPath)
    .pipe notify message: 'complete'

gulp.task 'hardPacking', ->
  gulp
  .src [path.join(publicJsPath, 'common.js')]
  .pipe streamify(uglify())
  .pipe gzip()
  .pipe gulp.dest(publicJsPath)
  .pipe notify message: 'complete'

gulp.task 'softPacking', ->
  gulp
  .src [path.join(publicJsPath, 'common.js')]
  .pipe streamify(uglify())
  .pipe gulp.dest(publicJsPath)
  .pipe notify message: 'complete'
