var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var notify = require('gulp-notify');
var tarsConfig = require('../../../tars-config');
var notifier = require('../../helpers/notifier');
var browserSync = require('browser-sync');

var dpi = tarsConfig.useImagesForDisplayWithDpi;

/**
 * Make sprite and stylus for this sprite
 * @param  {Object} buildOptions
 */
module.exports = function(buildOptions) {

    return gulp.task('css:make-sprite', function() {

        var spriteData = [],
            dpiLength = dpi.length,
            dpi192 = false,
            dpi288 = false,
            dpi384 = false;

        for (var i = 0; i < dpiLength; i++) {
            if (dpi[i] == 192) {
                dpi192 = true;
            } else if (dpi[i] === 288) {
                dpi288 = true;
            } else if (dpi[i] === 384) {
                dpi384 = true;
            }
        }

        for (var i = 0; i < dpiLength; i++) {
            spriteData.push(gulp.src('./markup/' + tarsConfig.fs.staticFolderName + '/' + tarsConfig.fs.imagesFolderName + '/sprite/' + dpi[i] + 'dpi/*.png')
                .pipe(
                    spritesmith(
                        {
                            imgName: 'sprite.png',
                            cssName: 'sprite' + dpi[i] + '.styl',
                            Algorithms: 'diagonal',
                            engineOpts: {
                                imagemagick: true
                            },
                            cssOpts: {
                                dpi192: dpi192,
                                dpi288: dpi288,
                                dpi384: dpi384
                            },
                            cssTemplate: './markup/' + tarsConfig.fs.staticFolderName + '/stylus/spriteGeneratorTemplates/stylus.sprite.mustache'
                        }
                    )
                )
                .on('error', notify.onError(function (error) {
                    return '\nAn error occurred while making png-sprite.\nLook in the console for details.\n' + error;
                }))
            );

            spriteData[i].img.pipe(gulp.dest('./dev/' + tarsConfig.fs.staticFolderName + '/' + tarsConfig.fs.imagesFolderName + '/pngSprite/' + dpi[i] + 'dpi/'))
                .pipe(
                    notifier('Sprite img with dpi = ' + dpi[i] + ' is ready')
                );
        }

        return spriteData[0].css.pipe(gulp.dest('./markup/' + tarsConfig.fs.staticFolderName + '/stylus/spritesStylus/'))
                .pipe(browserSync.reload({stream:true}))
                .pipe(
                    notifier('Stylus for sprites is ready')
                );
        });
};