var canvas_w = 705;
var canvas_h = 195;
var x_start = 50;
var y_start = 155;
var x_origin = 55;
var y_origin = 150;
var x_end = 655;
var y_end = 20;
var y_grid = 13;
var count = 600;

function get_time(time)
{
	var ret = new Array();
	ret['second'] = time.split(' ')[1].split(':')[2];
	ret['minute'] = time.split(' ')[1].split(':')[1];
	ret['hour'] = time.split(' ')[1].split(':')[0];
	ret['date'] = time.split(' ')[0].split('/')[1];
	ret['month'] = time.split(' ')[0].split('/')[0] - 1;
	
	return ret;
}


/**
 * @brief Get the number of days of given month
 */
function days_of_month(fullyear, month)
{
	var days = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	if (month != 1) { // start from 0
		return days[month];
	}

	if (!(fullyear % 400)) {
		return 29;
	} else if (!(fullyear % 100)) {
		return 28;
	} else if (!(fullyear % 4)) {
		return 29;
	} else {
		return 28;
	}	
}

/**
 * @brief Write the title, updated time, current Kbps and max Kbps down
 * @param ctx Context of canvas
 * @param title Chart title
 * @param data Uptime, current Kbps and max Kbps
 */
function write_chart_description(ctx, title, data)
{
	ctx.textBaseline = "top";
	ctx.textAlign = "center";
	ctx.font = "bold 16px sans-serif";
	ctx.fillText(title, canvas_w / 2, 0);

	ctx.font = "bold 12px sans-serif";
	var desc = "Latest Update at: " + data["last_update"];
	desc += "    [Current: " + data["node"][count-1] + " Kbps] [Maximum: ";
	desc += data['maximum']+ " Kbps]";
	ctx.fillText(desc, canvas_w / 2, y_start + 15);
}

/**
 * @brief Canvas doesn't support dashed / dotted lines
 * @param ctx Context of canvas
 * @param start Start point
 * @param end End point
 * @param same x or y coordinate
 * @param layout 0 for horizontal, 1 for vertical
 * @param width Width of dashes
 * @param space Space between dashes
 * @param color Color of line
 */
function draw_dashed_line(ctx, start, end, same, layout, width, space, color)
{
	ctx.beginPath();
	ctx.strokeStyle = color;
	if (layout) { // vertical
		for (var i = start; i >= end; i -= (width + space)) {
			var tmp = i + width;
			tmp = (tmp < end) ? end : tmp;
			ctx.moveTo(same, i);
			ctx.lineTo(same, tmp);
		}
	} else { // horizontal
		for (var i = start; i <= end; i += (width + space)) {
			var tmp = i + width;
			tmp = (tmp > end) ? end : tmp;
			ctx.moveTo(i, same);
			ctx.lineTo(tmp, same);
		}
	}
	ctx.stroke();
}

function draw_common_part(ctx, data)
{
	var limit = 0;
	var level = 10;

	if (data['maximum'] >= 10000) {
		level = 10000;
	} else if (data['maximum'] >= 1000) {
		level = 1000;
	} else if (data['maximum'] >= 100) {
		level = 100;
	}
	limit = parseInt(data['maximum'] / level + 1) * level;

	// data
	var y_len = y_origin - y_end;
	var column_len = 0;
	ctx.beginPath();
	ctx.strokeStyle = "#33ff33";
	for (var i = 0; i < 600; ++i) {
		column_len = y_len * (data['node'][i] / limit);
		ctx.moveTo(x_origin + i, y_origin);
		ctx.lineTo(x_origin + i, y_origin - column_len);
	}
	ctx.stroke();

	// axises
	ctx.textBaseline = "middle";
	ctx.textAlign = "right";
	ctx.beginPath();
	ctx.strokeStyle = "#000000";
	ctx.moveTo(x_start, y_origin);
	ctx.lineTo(x_end, y_origin);
	ctx.moveTo(x_origin, y_start);
	ctx.lineTo(x_origin, y_end);
	ctx.stroke();
	ctx.fillText(0, x_start - 2, y_origin);

	// Y grids
	var label = 0;
	for (var y = y_origin - y_grid; y >= y_end; y -= y_grid) {
		label += (limit / 10);
		draw_dashed_line(ctx, x_start, x_end, y, 0, 3, 1, "#999999");
		ctx.fillText(label, x_start - 2, y);
	}
}

function draw_data_mins(ctx, data)
{
	var secs_of_px = 6;
	var px_of_min = 10;
	var time = get_time(data['last_update']);
	var latest_px = time['second'] / secs_of_px;
	var now_at = time['minute'];
	var latest_at = x_end - latest_px;

	for (var x = latest_at; x >= x_origin; x -= px_of_min) {
		if (!(now_at % 2)) ctx.fillText(now_at, x, y_start + 2);
		if (!now_at) {
			ctx.beginPath();
			ctx.strokeStyle = "#FF0000";
			ctx.moveTo(x, y_start);
			ctx.lineTo(x, y_end);
			ctx.stroke();
		} else {
			draw_dashed_line(ctx, y_start - 2, y_end, x,
				1, 3, 1, "#999999");
		}
		now_at = (now_at + 60 - 1) % 60;
	}

	write_chart_description(ctx, "Past 60 Minutes", data);
}

function draw_data_hours(ctx, data)
{
	var mins_of_px = 3;
	var px_of_hour = 20;
	var time = get_time(data['last_update']);
	var latest_px = time['minute'] / mins_of_px;
	var now_at = time['hour'];
	var latest_at = x_end - latest_px;

	for (var x = latest_at; x >= x_origin; x -= px_of_hour) {
		ctx.fillText(now_at, x, y_start + 2);
		if (!now_at) {
			ctx.beginPath();
			ctx.strokeStyle = "#FF0000";
			ctx.moveTo(x, y_start);
			ctx.lineTo(x, y_end);
			ctx.stroke();
		} else {
			draw_dashed_line(ctx, y_start - 2, y_end, x,
				1, 3, 1, "#999999");
		}
		now_at = (now_at + 24 - 1) % 24;
	}

	write_chart_description(ctx, "Past 30 Hours", data);
}

function draw_data_days(ctx, data)
{
	var hours_of_px = 2;
	var px_of_day = 12;
	var time = get_time(data['last_update']);
	var latest_px = time['hour'] / hours_of_px;
	var now_at = time['date'] - 1;
	var now_month = time['month'];
	var now_year = new Date().getFullYear();
	var latest_at = x_end - latest_px;

	for (var x = latest_at; x >= x_origin; x -= px_of_day) {
		if (!(now_at % 2) && now_at != 30) {
			ctx.fillText(now_at + 1, x, y_start + 2);
		}
		if (!now_at) {
			ctx.strokeStyle = "#FF0000";
			ctx.beginPath();
			ctx.moveTo(x, y_start);
			ctx.lineTo(x, y_end);
			ctx.stroke();

			if (!now_month) now_year--;
			now_month = (now_month + 11) % 12;
			now_at = days_of_month(now_year, now_month) - 1;
		} else {
			draw_dashed_line(ctx, y_start - 2, y_end, x,
				1, 3, 1, "#999999");
			now_at--;
		}
	}

	write_chart_description(ctx, "Past 50 days", data);
}

function draw_charts(ctx, data)
{
	ctx.font = "11px sans-serif";
	draw_common_part(ctx, data);

	ctx.textBaseline = "top";
	ctx.textAlign = "center";
}

function write_at(ctx, x, y, text)
{
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.font = "20px sans-serif";
	ctx.fillText(text, x, y);
}

function handleStateChange(stat, units)
{
	if (units == "6sec")
	{
		var ctx_min = document.getElementById("canvas-min").getContext('2d');
		ctx_min.clearRect(0, 0, canvas_w, canvas_h);
		draw_charts(ctx_min, stat);
		draw_data_mins(ctx_min, stat);
	}
	else if (units == "3min")
	{
		var ctx_hour = document.getElementById("canvas-hour").getContext('2d');
		ctx_hour.clearRect(0, 0, canvas_w, canvas_h);
		draw_charts(ctx_hour, stat);
		draw_data_hours(ctx_hour, stat);
	}
	else
	{
		var ctx_day = document.getElementById("canvas-day").getContext('2d');
		ctx_day.clearRect(0, 0, canvas_w, canvas_h);
		draw_charts(ctx_day, stat);
		draw_data_days(ctx_day, stat);
	}
}

function handleState(units, error)
{
	if (units == "6sec")
	{
		var ctx_min = document.getElementById("canvas-min").getContext('2d');
		ctx_min.clearRect(0, 0, canvas_w, canvas_h);
		if (error)
			write_at(ctx_min, canvas_w/2, canvas_h/2, "No Data");
		else
			write_at(ctx_min, canvas_w/2, canvas_h/2, "Loading");
	}
	else if (units == "3min")
	{
		var ctx_hour = document.getElementById("canvas-hour").getContext('2d');
		ctx_hour.clearRect(0, 0, canvas_w, canvas_h);
		if (error)
			write_at(ctx_hour, canvas_w/2, canvas_h/2, "No Data");
		else
			write_at(ctx_hour, canvas_w/2, canvas_h/2, "Loading");
	}
	else
	{
		var ctx_day = document.getElementById("canvas-day").getContext('2d');
		ctx_day.clearRect(0, 0, canvas_w, canvas_h);
		if (error)
			write_at(ctx_day, canvas_w/2, canvas_h/2, "No Data");
		else
			write_at(ctx_day, canvas_w/2, canvas_h/2, "Loading");
	}
}

/**
 * @brief Request to bandwidth_ajax
 */
function request_bmstat(units)
{
	$.ajax({
		url: 'statBandwidthUtilizationHandler',
		type: 'POST',
		data: {
			pos: "wan" + $('#sel_wan').val(),
			direction: $('#sel_traffic').val(),
			unit: units
		},
		beforeSend: function(xhr) {
			handleState(units, false);
		},
		error: function(xhr) {
			handleState(units, true);
		},
		success: function(response) {
			if (response[0]) //get data
			{
				handleStateChange(response[1], units);
			}
			else //error
			{
				alert(response[1] + ": " + units);
				handleState(units, true);
			}
		}
	});
}

function handle_bmstat()
{
	request_bmstat("6sec");
	request_bmstat("3min");
	request_bmstat("2hrs");
}

$(function(){
	$('#sel_wan, #sel_traffic').change(function(){
		handle_bmstat();
	});

	$('#refresh').click(function(){
		handle_bmstat();
	});

	handle_bmstat();

	NotifyUser();
});
