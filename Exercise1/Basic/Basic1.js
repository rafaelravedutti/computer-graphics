function drawPixelwiseCircle(canvas) {
    var context = canvas.getContext("2d");
    var img = context.createImageData(200, 200);
    var width = 200, height = 200;
    var channels = 4;
    var pos_x = 100, pos_y = 100;
    var radius = 50.0;

    for(var j = -radius; j < radius; j++) {
        for(var i = -radius; i < radius; i++) {
            if(i * i + j * j <= radius * radius) {
                var x = (pos_x + i) * channels;
                var y = (pos_y + j) * channels;

                img.data[y * width + x] = 0;
                img.data[y * width + x + 1] = 255;
                img.data[y * width + x + 2] = 0;
                img.data[y * width + x + 3] = 255;
            }
        }
    }

    context.putImageData(img, 0, 0);
}

function drawContourCircle(canvas) {
    var context = canvas.getContext("2d");
    var img = context.createImageData(200, 200);
    var width = 200, height = 200;
    var channels = 4;
    var pos_x = 100, pos_y = 100;
    var radius = 50.0, contour_radius = 10.0;
    var contour_inner_radius = (radius - (contour_radius / 2.0));
    var contour_outter_radius = (radius + (contour_radius / 2.0));

    for(var j = -radius; j < radius; j++) {
        for(var i = -radius; i < radius; i++) {
            if(i * i + j * j <= radius * radius) {
                var x = (pos_x + i) * channels;
                var y = (pos_y + j) * channels;

                img.data[y * width + x] = 0;
                img.data[y * width + x + 1] = 255;
                img.data[y * width + x + 2] = 0;
                img.data[y * width + x + 3] = 255;
            }
        }
    }

    for(var j = -contour_outter_radius; j < contour_outter_radius; j++) {
        for(var i = -contour_outter_radius; i < contour_outter_radius; i++) {
            if(
                i * i + j * j >= contour_inner_radius * contour_inner_radius &&
                i * i + j * j <= contour_outter_radius * contour_outter_radius
            ) {
                var x = (pos_x + i) * channels;
                var y = (pos_y + j) * channels;

                img.data[y * width + x] = 0;
                img.data[y * width + x + 1] = 127;
                img.data[y * width + x + 2] = 0;
                img.data[y * width + x + 3] = 255;
            }
        }
    }

    context.putImageData(img, 0, 0);
}

function drawSmoothCircle(canvas) {
    var context = canvas.getContext("2d");
    var img = context.createImageData(200, 200);
    var width = 200, height = 200;
    var channels = 4;
    var pos_x = 100, pos_y = 100;
    var radius = 50.0, contour_radius = 10.0;
    var contour_inner_radius = (radius - (contour_radius / 2.0));
    var contour_outter_radius = (radius + (contour_radius / 2.0));

    for(var j = -radius; j < radius; j++) {
        for(var i = -radius; i < radius; i++) {
            if(i * i + j * j <= radius * radius) {
                var x = (pos_x + i) * channels;
                var y = (pos_y + j) * channels;

                img.data[y * width + x] = 0;
                img.data[y * width + x + 1] = 255;
                img.data[y * width + x + 2] = 0;
                img.data[y * width + x + 3] = 255;
            }
        }
    }

    for(var j = -contour_outter_radius; j < contour_outter_radius; j++) {
        for(var i = -contour_outter_radius; i < contour_outter_radius; i++) {
            var pos_square = i * i + j * j;
            var inner_rad_square = contour_inner_radius * contour_inner_radius;
            var outter_rad_square = contour_outter_radius * contour_outter_radius;
            var inner_border_rad_square = (contour_inner_radius + 1.0) * (contour_inner_radius + 1.0);
            var outter_border_rad_square = (contour_outter_radius - 1.0) * (contour_outter_radius - 1.0);

            if(pos_square >= inner_rad_square && pos_square <= outter_rad_square) {
                var x = (pos_x + i) * channels;
                var y = (pos_y + j) * channels;
                var center_distance = Math.sqrt(pos_square);

                if(pos_square <= inner_border_rad_square) {
                    var color_level = center_distance / (contour_inner_radius + 1.0);

                    img.data[y * width + x] = 0;
                    img.data[y * width + x + 1] = 255 - color_level * 128;
                    img.data[y * width + x + 2] = 0;
                    img.data[y * width + x + 3] = 255;
                } else if(pos_square >= outter_border_rad_square) {
                    var color_level = center_distance / contour_outter_radius;

                    img.data[y * width + x] = color_level * 255;
                    img.data[y * width + x + 1] = 255;
                    img.data[y * width + x + 2] = color_level * 255;
                    img.data[y * width + x + 3] = 255;
                } else {
                    img.data[y * width + x] = 0;
                    img.data[y * width + x + 1] = 127;
                    img.data[y * width + x + 2] = 0;
                    img.data[y * width + x + 3] = 255;
                }
            }
        }
    }

    context.putImageData(img, 0, 0);
}
