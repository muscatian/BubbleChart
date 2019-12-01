// Generated by CoffeeScript 1.8.0
(function () {
    var BubbleChart, root,
        __bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; };

    BubbleChart = (function () {
        function BubbleChart(data) {
            this.hide_details = __bind(this.hide_details, this);
            this.show_details = __bind(this.show_details, this);
            this.hide_years = __bind(this.hide_years, this);
            this.display_years = __bind(this.display_years, this);
            this.move_towards_year = __bind(this.move_towards_year, this);
            this.display_by_year = __bind(this.display_by_year, this);
            this.move_towards_center = __bind(this.move_towards_center, this);
            this.display_group_all = __bind(this.display_group_all, this);
            this.start = __bind(this.start, this);
            this.create_vis = __bind(this.create_vis, this);
            this.create_nodes = __bind(this.create_nodes, this);
            var max_amount;
            this.data = data;
            this.width = 1300;
            this.height = 600;
            this.tooltip = CustomTooltip("gates_tooltip", 240);
            this.center = {
                x: this.width / 2,
                y: this.height / 2
            };
            this.year_centers = {
                "Feasible Sudies": {
                    x: this.width / 4,
                    y: this.height / 2
                },
                "Concept / Define": {
                    x: this.width / 3,
                    y: this.height / 2
                },
                "Pilot / Execute": {
                    x: 3 * this.width / 4,
                    y: this.height / 2
                },
                "On-Stream (Last Year)": {
                    x: 2 * this.width / 4,
                    y: this.height / 2
                }
            };
            this.layout_gravity = -0.01;
            this.damper = 0.1;
            this.vis = null;
            this.vis2 = null;
            this.nodes = [];
            this.force = null;
            this.circles = null;
            this.fill_color = d3.scale.ordinal().domain(["low", "medium", "high", "critical"]).range(["#33FF46", "#A68BC2", "#C8869B", "#80B0A5"]);
            max_amount = d3.max(this.data, function (d) {
                //console.log("max_amount :: " + parseInt(d.total_amount));
                return parseInt(d.total_amount);
            });
            this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 40]);
            this.create_nodes();
            //console.log("create_nodes");
            this.create_vis();
            //console.log("create_vis");

        }

        BubbleChart.prototype.create_nodes = function () {
            this.data.forEach((function (_this) {
                return function (d) {
                    var node;
                    node = {
                        id: d.id,
                        radius: _this.radius_scale(parseInt(d.total_amount)),
                        value: d.total_amount,
                        name: d.grant_title,
                        org: d.organization,
                        group: d.group,
                        year: d.start_year,
                        x: Math.random() * 900,
                        y: Math.random() * 800
                    };
                    //console.log("Node Raduus :: " + node.radius);
                    //console.log("Node x :: " + node.x);
                    //console.log("Node y :: " + node.y);

                    //d3.select("path#path50").append("circle").attr("r", node.radius).attr("cx", node.x).attr("cy", node.y);

                    d3.select("#svg2").append("circle").attr("r", node.radius).attr("cx", node.x).attr("cy", node.y);
                    //d3.select("svg").append("circle").attr("r", node.radius).attr("cx", node.x).attr("cy", node.y);
                    return _this.nodes.push(node);
                };
            })(this));
            return this.nodes.sort(function (a, b) {
                return b.value - a.value;
            });
        };

        BubbleChart.prototype.create_vis = function () {
            //console.log("BubbleChart.prototype.create_vis");
            var that;
            this.vis = d3.select("#vis").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
            this.circles = this.vis.selectAll("circle").data(this.nodes, function (d) {
                return d.id;
            });
            that = this;
            this.circles.enter().append("circle").attr("r", 0).attr("fill", (function (_this) {
                return function (d) {
                    return _this.fill_color(d.group);
                };
            })(this)).attr("stroke-width", 2).attr("stroke", (function (_this) {
                return function (d) {
                    return d3.rgb(_this.fill_color(d.group)).darker();
                };
            })(this)).attr("id", function (d) {
                return "bubble_" + d.id;
            }).on("mouseover", function (d, i) {
                return that.show_details(d, i, this);
            }).on("mouseout", function (d, i) {
                return that.hide_details(d, i, this);
                });

            console.log(this.circles);

            //d3.select("#svg2").append(this.circles);

            return this.circles.transition().duration(2000).attr("r", function (d) {
                return d.radius;
            });
        };

        

        BubbleChart.prototype.charge = function (d) {
            return -Math.pow(d.radius, 2.0) / 8;
        };

        BubbleChart.prototype.start = function () {
            return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
        };

        BubbleChart.prototype.display_group_all = function () {
            this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function (_this) {
                return function (e) {
                    return _this.circles.each(_this.move_towards_center(e.alpha)).attr("cx", function (d) {
                        return d.x;
                    }).attr("cy", function (d) {
                        return d.y;
                    });
                };
            })(this));
            this.force.start();
            return this.hide_years();
        };

        BubbleChart.prototype.move_towards_center = function (alpha) {
            return (function (_this) {
                return function (d) {
                    d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.02) * alpha;
                    return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.02) * alpha;
                };
            })(this);
        };

        BubbleChart.prototype.display_by_year = function () {
            this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function (_this) {
                return function (e) {
                    return _this.circles.each(_this.move_towards_year(e.alpha)).attr("cx", function (d) {
                        return d.x;
                    }).attr("cy", function (d) {
                        return d.y;
                    });
                };
            })(this));
            this.force.start();
            return this.display_years();
        };

        BubbleChart.prototype.move_towards_year = function (alpha) {
            return (function (_this) {
                return function (d) {
                    var target;
                    target = _this.year_centers[d.year];
                    d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
                    return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
                };
            })(this);
        };

        BubbleChart.prototype.display_years = function () {
            var years, years_data, years_x;
            // concole.log("this.width " + years_x.width);
            years_x = {
                "Feasible Sudies": 160,
                "Concept / Define": this.width / 3,
                "Pilot / Execute": this.width / 2,
                "On-Stream (Last Year)": this.width - 160
            };
            years_data = d3.keys(years_x);
            years = this.vis.selectAll(".years").data(years_data);
            return years.enter().append("text").attr("class", "years").attr("x", (function (_this) {
                return function (d) {
                    return years_x[d];
                };
            })(this)).attr("y", 40).attr("text-anchor", "middle").text(function (d) {
                return d;
            });
        };

        BubbleChart.prototype.hide_years = function () {
            var years;
            return years = this.vis.selectAll(".years").remove();
        };

        BubbleChart.prototype.show_details = function (data, i, element) {
            var content;
            d3.select(element).attr("stroke", "black");
            content = "<span class=\"name\">Title:</span><span class=\"value\"> " + data.name + "</span><br/>";
            content += "<span class=\"name\">Amount:</span><span class=\"value\"> $" + (addCommas(data.value)) + "</span><br/>";
            content += "<span class=\"name\">Year:</span><span class=\"value\"> " + data.year + "</span>";
            return this.tooltip.showTooltip(content, d3.event);
        };

        BubbleChart.prototype.hide_details = function (data, i, element) {
            d3.select(element).attr("stroke", (function (_this) {
                return function (d) {
                    return d3.rgb(_this.fill_color(d.group)).darker();
                };
            })(this));
            return this.tooltip.hideTooltip();
        };

        return BubbleChart;

    })();

    root = typeof exports !== "undefined" && exports !== null ? exports : this;

    $(function () {
        var chart, render_vis;
        chart = null;
        render_vis = function (csv) {
            //console.log(JSON.stringify(csv));
            chart = new BubbleChart(csv);
            chart.start();
            return root.display_year();
        };
        root.display_all = (function (_this) {
            return function () {
                return chart.display_group_all();
            };
        })(this);
        root.display_year = (function (_this) {
            return function () {
                return chart.display_by_year();
            };
        })(this);
        root.toggle_view = (function (_this) {
            return function (view_type) {
                if (view_type === 'year') {
                    return root.display_year();
                } else {
                    return root.display_all();
                }
            };
        })(this);
        return (JSON.parse('[{"grant_title":"TPERF Statewide Education Summit and Legislative Briefing","id":"1","organization":"Texas Public Education Reform Foundation","total_amount":"1","group":"low","Grant start date":"10/1/2008","start_month":"10","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"National Education Forum","id":"2","organization":"The Library of Congress","total_amount":"1","group":"low","Grant start date":"3/1/2008","start_month":"3","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"California Collaborative on District Reform Phase 2","id":"3","organization":"American Institutes for Research","total_amount":"2","group":"medium","Grant start date":"3/1/2008","start_month":"3","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"Advocacy for Sustained School Reform in the Nations Capital","id":"4","organization":"DC VOICE","total_amount":"2","group":"critical","Grant start date":"7/1/2008","start_month":"7","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"Gates-EdVisions Moving Forward","id":"5","organization":"EdVisions Inc","total_amount":"3","group":"high","Grant start date":"12/1/2008","start_month":"12","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"Texas Education Research Support","id":"6","organization":"College for All Texans Foundation: Closing the Gaps","total_amount":"3","group":"critical","Grant start date":"11/1/2008","start_month":"11","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"TPERF Statewide Education Summit and Legislative Briefing","id":"7","organization":"Texas Public Education Reform Foundation","total_amount":"1","group":"low","Grant start date":"10/1/2008","start_month":"10","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"National Education Forum","id":"8","organization":"The Library of Congress","total_amount":"1","group":"low","Grant start date":"3/1/2008","start_month":"3","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"California Collaborative on District Reform Phase 2","id":"9","organization":"American Institutes for Research","total_amount":"2","group":"medium","Grant start date":"3/1/2008","start_month":"3","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"Advocacy for Sustained School Reform in the Nations Capital","id":"10","organization":"DC VOICE","total_amount":"2","group":"medium","Grant start date":"7/1/2008","start_month":"7","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"Gates-EdVisions Moving Forward","id":"11","organization":"EdVisions Inc","total_amount":"3","group":"high","Grant start date":"12/1/2008","start_month":"12","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"Texas Education Research Support","id":"12","organization":"College for All Texans Foundation: Closing the Gaps","total_amount":"3","group":"high","Grant start date":"11/1/2008","start_month":"11","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"TPERF Statewide Education Summit and Legislative Briefing","id":"13","organization":"Texas Public Education Reform Foundation","total_amount":"1","group":"critical","Grant start date":"10/1/2008","start_month":"10","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"National Education Forum","id":"14","organization":"The Library of Congress","total_amount":"1","group":"low","Grant start date":"3/1/2008","start_month":"3","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"California Collaborative on District Reform Phase 2","id":"15","organization":"American Institutes for Research","total_amount":"2","group":"medium","Grant start date":"3/1/2008","start_month":"3","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"Advocacy for Sustained School Reform in the Nations Capital","id":"16","organization":"DC VOICE","total_amount":"2","group":"medium","Grant start date":"7/1/2008","start_month":"7","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"Gates-EdVisions Moving Forward","id":"17","organization":"EdVisions Inc","total_amount":"3","group":"high","Grant start date":"12/1/2008","start_month":"12","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"Texas Education Research Support","id":"18","organization":"College for All Texans Foundation: Closing the Gaps","total_amount":"3","group":"high","Grant start date":"11/1/2008","start_month":"11","start_day":"1","start_year":"Feasible Sudies"},{"grant_title":"Teacher-Student Data Link Project","id":"19","organization":"CELT Corporation","total_amount":"1","group":"critical","Grant start date":"11/19/2009","start_month":"11","start_day":"19","start_year":"Concept / Define"},{"grant_title":"Business Planning for Education grantees","id":"20","organization":"The Bridgespan Group","total_amount":"2","group":"medium","Grant start date":"4/20/2009","start_month":"4","start_day":"20","start_year":"Concept / Define"},{"grant_title":"Develop Tools for Teachers/Districts to Monitor Student Progress","id":"21","organization":"Math Solutions","total_amount":"2","group":"medium","Grant start date":"11/20/2009","start_month":"11","start_day":"20","start_year":"Concept / Define"},{"grant_title":"IB Middle Years Summative Assessment","id":"22","organization":"IB Fund US Inc.","total_amount":"2","group":"critical","Grant start date":"8/22/2009","start_month":"8","start_day":"22","start_year":"Concept / Define"},{"grant_title":"Intensive Partnerships to Empower Effective Teachers","id":"23","organization":"Memphis City Schools","total_amount":"3","group":"high","Grant start date":"11/19/2009","start_month":"11","start_day":"19","start_year":"Concept / Define"},{"grant_title":"Intensive Partnerships to Empower Effective Teachers","id":"24","organization":"Hillsborough County Public Schools","total_amount":"3","group":"high","Grant start date":"11/19/2009","start_month":"11","start_day":"19","start_year":"Concept / Define"},{"grant_title":"Teacher-Student Data Link Project","id":"25","organization":"CELT Corporation","total_amount":"1","group":"low","Grant start date":"11/19/2009","start_month":"11","start_day":"19","start_year":"Concept / Define"},{"grant_title":"Business Planning for Education grantees","id":"26","organization":"The Bridgespan Group","total_amount":"2","group":"medium","Grant start date":"4/20/2009","start_month":"4","start_day":"20","start_year":"Concept / Define"},{"grant_title":"Develop Tools for Teachers/Districts to Monitor Student Progress","id":"27","organization":"Math Solutions","total_amount":"2","group":"critical","Grant start date":"11/20/2009","start_month":"11","start_day":"20","start_year":"Concept / Define"},{"grant_title":"IB Middle Years Summative Assessment","id":"28","organization":"IB Fund US Inc.","total_amount":"2","group":"medium","Grant start date":"8/22/2009","start_month":"8","start_day":"22","start_year":"Concept / Define"},{"grant_title":"Intensive Partnerships to Empower Effective Teachers","id":"29","organization":"Memphis City Schools","total_amount":"3","group":"high","Grant start date":"11/19/2009","start_month":"11","start_day":"19","start_year":"Concept / Define"},{"grant_title":"Intensive Partnerships to Empower Effective Teachers","id":"30","organization":"Hillsborough County Public Schools","total_amount":"3","group":"critical","Grant start date":"11/19/2009","start_month":"11","start_day":"19","start_year":"Concept / Define"},{"grant_title":"Teacher-Student Data Link Project","id":"31","organization":"CELT Corporation","total_amount":"1","group":"low","Grant start date":"11/19/2009","start_month":"11","start_day":"19","start_year":"Concept / Define"},{"grant_title":"Business Planning for Education grantees","id":"32","organization":"The Bridgespan Group","total_amount":"2","group":"medium","Grant start date":"4/20/2009","start_month":"4","start_day":"20","start_year":"Concept / Define"},{"grant_title":"Develop Tools for Teachers/Districts to Monitor Student Progress","id":"33","organization":"Math Solutions","total_amount":"2","group":"critical","Grant start date":"11/20/2009","start_month":"11","start_day":"20","start_year":"Concept / Define"},{"grant_title":"IB Middle Years Summative Assessment","id":"34","organization":"IB Fund US Inc.","total_amount":"2","group":"critical","Grant start date":"8/22/2009","start_month":"8","start_day":"22","start_year":"Concept / Define"},{"grant_title":"Intensive Partnerships to Empower Effective Teachers","id":"35","organization":"Memphis City Schools","total_amount":"3","group":"high","Grant start date":"11/19/2009","start_month":"11","start_day":"19","start_year":"Concept / Define"},{"grant_title":"Intensive Partnerships to Empower Effective Teachers","id":"36","organization":"Hillsborough County Public Schools","total_amount":"3","group":"critical","Grant start date":"11/19/2009","start_month":"11","start_day":"19","start_year":"Concept / Define"},{"grant_title":"New Mexico Business Roundtable","id":"37","organization":"New Mexico Business Roundtable for Educational Excellence","total_amount":"1","group":"low","Grant start date":"2/4/2010","start_month":"2","start_day":"4","start_year":"Pilot / Execute"},{"grant_title":"Convening of Stakeholder Planning Committee for the Institute for Local Innovation in Teaching and Learning","id":"38","organization":"The NEA Foundation for the Improvement of Education","total_amount":"1","group":"low","Grant start date":"3/11/2010","start_month":"3","start_day":"11","start_year":"Pilot / Execute"},{"grant_title":"Using web-based videos to teach math to high school students","id":"39","organization":"Guaranteach","total_amount":"2","group":"medium","Grant start date":"3/18/2010","start_month":"3","start_day":"18","start_year":"Pilot / Execute"},{"grant_title":"Intermediary management of PRI/Credit Enhancement Program - Los Angeles (Aspire)","id":"40","organization":"NCB Capital Impact","total_amount":"2","group":"medium","Grant start date":"4/8/2010","start_month":"4","start_day":"8","start_year":"Pilot / Execute"},{"grant_title":"General Support Supplemental","id":"41","organization":"The Education Trust","total_amount":"2","group":"critical","Grant start date":"1/21/2010","start_month":"1","start_day":"21","start_year":"Pilot / Execute"},{"grant_title":"Measures of Effective Teaching Research Site","id":"42","organization":"Dallas Independent School District","total_amount":"3","group":"low","Grant start date":"1/4/2010","start_month":"1","start_day":"4","start_year":"Pilot / Execute"},{"grant_title":"Accelerated Partnership to Empower Effective Teachers","id":"43","organization":"Atlanta Public Schools","total_amount":"3","group":"critical","Grant start date":"1/13/2010","start_month":"1","start_day":"13","start_year":"Pilot / Execute"},{"grant_title":"New Mexico Business Roundtable","id":"44","organization":"New Mexico Business Roundtable for Educational Excellence","total_amount":"1","group":"critical","Grant start date":"2/4/2010","start_month":"2","start_day":"4","start_year":"Pilot / Execute"},{"grant_title":"Convening of Stakeholder Planning Committee for the Institute for Local Innovation in Teaching and Learning","id":"45","organization":"The NEA Foundation for the Improvement of Education","total_amount":"1","group":"low","Grant start date":"3/11/2010","start_month":"3","start_day":"11","start_year":"Pilot / Execute"},{"grant_title":"Using web-based videos to teach math to high school students","id":"46","organization":"Guaranteach","total_amount":"2","group":"critical","Grant start date":"3/18/2010","start_month":"3","start_day":"18","start_year":"Pilot / Execute"},{"grant_title":"Intermediary management of PRI/Credit Enhancement Program - Los Angeles (Aspire)","id":"47","organization":"NCB Capital Impact","total_amount":"2","group":"medium","Grant start date":"4/8/2010","start_month":"4","start_day":"8","start_year":"Pilot / Execute"},{"grant_title":"General Support Supplemental","id":"48","organization":"The Education Trust","total_amount":"2","group":"critical","Grant start date":"1/21/2010","start_month":"1","start_day":"21","start_year":"Pilot / Execute"},{"grant_title":"Measures of Effective Teaching Research Site","id":"49","organization":"Dallas Independent School District","total_amount":"3","group":"low","Grant start date":"1/4/2010","start_month":"1","start_day":"4","start_year":"Pilot / Execute"},{"grant_title":"Accelerated Partnership to Empower Effective Teachers","id":"50","organization":"Atlanta Public Schools","total_amount":"3","group":"low","Grant start date":"1/13/2010","start_month":"1","start_day":"13","start_year":"Pilot / Execute"},{"grant_title":"New Mexico Business Roundtable","id":"51","organization":"New Mexico Business Roundtable for Educational Excellence","total_amount":"1","group":"low","Grant start date":"2/4/2010","start_month":"2","start_day":"4","start_year":"Pilot / Execute"},{"grant_title":"Convening of Stakeholder Planning Committee for the Institute for Local Innovation in Teaching and Learning","id":"52","organization":"The NEA Foundation for the Improvement of Education","total_amount":"1","group":"critical","Grant start date":"3/11/2010","start_month":"3","start_day":"11","start_year":"Pilot / Execute"},{"grant_title":"Using web-based videos to teach math to high school students","id":"53","organization":"Guaranteach","total_amount":"2","group":"medium","Grant start date":"3/18/2010","start_month":"3","start_day":"18","start_year":"Pilot / Execute"},{"grant_title":"Intermediary management of PRI/Credit Enhancement Program - Los Angeles (Aspire)","id":"54","organization":"NCB Capital Impact","total_amount":"2","group":"medium","Grant start date":"4/8/2010","start_month":"4","start_day":"8","start_year":"Pilot / Execute"},{"grant_title":"General Support Supplemental","id":"55","organization":"The Education Trust","total_amount":"2","group":"critical","Grant start date":"1/21/2010","start_month":"1","start_day":"21","start_year":"Pilot / Execute"},{"grant_title":"Measures of Effective Teaching Research Site","id":"56","organization":"Dallas Independent School District","total_amount":"3","group":"low","Grant start date":"1/4/2010","start_month":"1","start_day":"4","start_year":"Pilot / Execute"},{"grant_title":"Accelerated Partnership to Empower Effective Teachers","id":"57","organization":"Atlanta Public Schools","total_amount":"3","group":"low","Grant start date":"1/13/2010","start_month":"1","start_day":"13","start_year":"Pilot / Execute"},{"grant_title":"TPERF Statewide Education Summit and Legislative Briefing","id":"58","organization":"Texas Public Education Reform Foundation","total_amount":"1","group":"critical","Grant start date":"10/1/2008","start_month":"10","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"National Education Forum","id":"59","organization":"The Library of Congress","total_amount":"1","group":"low","Grant start date":"3/1/2008","start_month":"3","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"California Collaborative on District Reform Phase 2","id":"60","organization":"American Institutes for Research","total_amount":"2","group":"medium","Grant start date":"3/1/2008","start_month":"3","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"Advocacy for Sustained School Reform in the Nations Capital","id":"61","organization":"DC VOICE","total_amount":"2","group":"medium","Grant start date":"7/1/2008","start_month":"7","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"Gates-EdVisions Moving Forward","id":"62","organization":"EdVisions Inc","total_amount":"3","group":"high","Grant start date":"12/1/2008","start_month":"12","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"Texas Education Research Support","id":"63","organization":"College for All Texans Foundation: Closing the Gaps","total_amount":"3","group":"high","Grant start date":"11/1/2008","start_month":"11","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"TPERF Statewide Education Summit and Legislative Briefing","id":"64","organization":"Texas Public Education Reform Foundation","total_amount":"1","group":"critical","Grant start date":"10/1/2008","start_month":"10","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"National Education Forum","id":"65","organization":"The Library of Congress","total_amount":"1","group":"critical","Grant start date":"3/1/2008","start_month":"3","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"California Collaborative on District Reform Phase 2","id":"66","organization":"American Institutes for Research","total_amount":"2","group":"medium","Grant start date":"3/1/2008","start_month":"3","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"Advocacy for Sustained School Reform in the Nations Capital","id":"67","organization":"DC VOICE","total_amount":"2","group":"critical","Grant start date":"7/1/2008","start_month":"7","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"Gates-EdVisions Moving Forward","id":"68","organization":"EdVisions Inc","total_amount":"3","group":"critical","Grant start date":"12/1/2008","start_month":"12","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"Texas Education Research Support","id":"69","organization":"College for All Texans Foundation: Closing the Gaps","total_amount":"3","group":"critical","Grant start date":"11/1/2008","start_month":"11","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"TPERF Statewide Education Summit and Legislative Briefing","id":"70","organization":"Texas Public Education Reform Foundation","total_amount":"1","group":"low","Grant start date":"10/1/2008","start_month":"10","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"National Education Forum","id":"71","organization":"The Library of Congress","total_amount":"1","group":"critical","Grant start date":"3/1/2008","start_month":"3","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"California Collaborative on District Reform Phase 2","id":"72","organization":"American Institutes for Research","total_amount":"2","group":"medium","Grant start date":"3/1/2008","start_month":"3","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"Advocacy for Sustained School Reform in the Nations Capital","id":"73","organization":"DC VOICE","total_amount":"2","group":"critical","Grant start date":"7/1/2008","start_month":"7","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"Gates-EdVisions Moving Forward","id":"74","organization":"EdVisions Inc","total_amount":"3","group":"critical","Grant start date":"12/1/2008","start_month":"12","start_day":"1","start_year":"On-Stream (Last Year)"},{"grant_title":"Texas Education Research Support","id":"75","organization":"College for All Texans Foundation: Closing the Gaps","total_amount":"3","group":"high","Grant start date":"11/1/2008","start_month":"11","start_day":"1","start_year":"On-Stream (Last Year)"}]'), render_vis);
    });

}).call(this);
