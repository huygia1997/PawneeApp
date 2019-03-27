sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";
	var serverInfo = {
		url: "http://192.168.2.60:8080",
		localUrl: "model",
		useLocal: false
	};
	return {
		getServerInfo: function() {
			return serverInfo;
		},
		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createNotiModel: function() {
			var model = new JSONModel([]);
			// setInterval(this.getNoti, 100000, ms);
			return model;
		},
		checkLogin: function(username, password) {
			var data;
			var ajaxData = {
				username: username,
				password: password
			};
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/account.json";
			} else {
				url = serverInfo.url + "/dang-nhap";
			}
			$.ajax({
				type: "POST",
				url: url,
				context: this,
				dataType: 'json',
				data: ajaxData,
				async: false,
				success: function(d, r, xhr) {
					console.log(d);
					data = d;
				},
				error: function(e) {
					console.log(e);
					data = e;
				}

			});
			return data;
		},

		checkRegister: function(email, password) {
			var data;
			var ajaxData = {
				email: email,
				password: password
			};
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/account.json";
			} else {
				url = serverInfo.url + "/dang-ky";
			}
			$.ajax({
				type: "POST",
				url: url,
				context: this,
				dataType: 'json',
				data: ajaxData,
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getBestShop: function(lat, lng) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/shop.json";
			} else if (lat === null || lng === null) {
				url = serverInfo.url + "/de-xuat-cua-hang";
			} else {
				url = serverInfo.url + "/de-xuat-cua-hang?lat=" + lat + "&lng=" + lng;
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getBestSaleItem: function(lat, lng) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/shop.json";
			} else if (lat === null || lng === null) {
				url = serverInfo.url + "/de-xuat-san-pham";
			} else {
				url = serverInfo.url + "/de-xuat-san-pham?lat=" + lat + "&lng=" + lng;
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getDataCity: function() {
			var data;
			var url = serverInfo.localUrl + "/dataLocation.json";
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}
			});
			return data;
		},

		getDataDistrict: function() {
			var data;
			var url = serverInfo.localUrl + "/dataDistrisct.json";
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}
			});
			return data;
		},

		getDataCategory: function() {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/category.json";
			} else {
				url = serverInfo.url + "/tao-danh-muc";
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getLocationNearBy: function(lat, lng) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/location.json";
			} else {
				url = serverInfo.url + "/search/shops/nearby?lat=" + lat + "&lng=" + lng;
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getNotifications: function(id) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/notifications.json";
			} else {
				url = serverInfo.url + "/get-new-notification?id=" + id;
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getShopDetail: function(shopId, userId) {
			var data = [];
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/shopDetail.json";
			} else {
				if (userId) {
					url = serverInfo.url + "/thong-tin-cua-hang?shopId=" + shopId + "&userId=" + userId;
				} else {
					url = serverInfo.url + "/thong-tin-cua-hang?shopId=" + shopId;
				}
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getUserDetail: function(userId) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/userDetail.json";
			} else {
				url = serverInfo.url + "/thong-tin-nguoi-dung?userId=" + userId;
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		searchShopByKeyword: function(query) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/shop.json";
			} else {
				url = serverInfo.url + "/search/shops?keyword=" + query;
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		searchItemByKeyword: function(query) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/shop.json";
			} else {
				url = serverInfo.url + "/search/items?keyword=" + query;
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getShopByFilter: function(cate, district) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/shop.json";
			} else {
				url = serverInfo.url + "/search/shops/filters?cate=" + cate + "&district=" + district;
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getShopBySort: function(page, sort) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/shop.json";
			} else {
				url = serverInfo.url + "/tat-ca-cua-hang?page=" + page + "&sort=" + sort;
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getItemBySort: function(sort, page) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/shop.json";
			} else {
				url = serverInfo.url + "/hang-thanh-ly?sort=" + sort + "&page=" + page;
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},
		
		getItemDetail: function(itemId, userId) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/shop.json";
			} else {
				if(userId) {
					url = serverInfo.url + "/thong-tin-san-pham?itemId=" + itemId + "&userId=" + userId;
				} else {
					url = serverInfo.url + "/thong-tin-san-pham?itemId=" + itemId;
				}
				
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},
		
		checkActivate: function(token) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/shop.json";
			} else {
				url = serverInfo.url + "/register?token=" + token;
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},
		
		updateUserInfo: function(data) {
			var callback, data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/shop.json";
			} else {
				url = serverInfo.url + "/thay-doi-thong-tin-nguoi-dung";
			}
			$.ajax({
				type: "POST",
				url: url,
				context: this,
				data: data,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
					callback = r;
				},
				error: function(e) {
					callback = e;
				}

			});
			return callback;
		}

	};

});