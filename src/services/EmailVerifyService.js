const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
var inlineBase64 = require("nodemailer-plugin-inline-base64");
const { getMaxListeners } = require("../models/UserModel");
const sendEmailVerify = async (name,email,hash,verificationCode,verificationLink) => {
	console.log("verificationLink",verificationLink);
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true, // use TLS
		auth: {
			user: process.env.MAIL_ACCOUNT, // generated ethereal user
			pass: process.env.MAIL_PASSWORD,
		},
	});
	// const verificationCode = Math.floor(100000 + Math.random() * 900000);
	transporter.use("compile",inlineBase64({ cidPrefix: "somePrefix_" }));
	// const fCurrencyVND = (number) => {
	//   const format = number ? numeral(number).format("0,0 VND") + " VNĐ" : "";

	//   return result(format, ".00");
	// };
	const formatter = new Intl.NumberFormat("vi-VN",{
		style: "currency",
		currency: "VND",
		minimumFractionDigits: 0,
	});
	const convert = (str) => {
		var date = new Date(str),
			mnth = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);
		return [day,mnth,date.getFullYear()].join("-");
	};
	let listItem = "";
	const attachImage = [];
	listItem += `
	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">

    <title></title>
    <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
    <!--[if gte mso 9]>
<xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
</xml>
<![endif]-->
    <!--[if !mso]><!-- -->
    <link href="https://fonts.googleapis.com/css2?family=Imprima&display=swap" rel="stylesheet">
    <!--<![endif]-->
		   <style type="text/css">
        /* CONFIG STYLES Please do not delete and edit CSS styles below */
        /* IMPORTANT THIS STYLES MUST BE ON FINAL EMAIL */
        /* ... (Thêm đoạn CSS của bạn ở đây) ... */
        /* END OF IMPORTANT */
      /* CONFIG STYLES Please do not delete and edit CSS styles below */
/* IMPORTANT THIS STYLES MUST BE ON FINAL EMAIL */
#outlook a {
	padding: 0;
}

.es-button {
	mso-style-priority: 100 !important;
	text-decoration: none !important;
}

a[x-apple-data-detectors] {
	color: inherit !important;
	text-decoration: none !important;
	font-size: inherit !important;
	font-family: inherit !important;
	font-weight: inherit !important;
	line-height: inherit !important;
}

.es-desk-hidden {
	display: none;
	float: left;
	overflow: hidden;
	width: 0;
	max-height: 0;
	line-height: 0;
	mso-hide: all;
}

/*
END OF IMPORTANT
*/
body {
	width: 100%;
	font-family: Imprima, Arial, sans-serif;
	-webkit-text-size-adjust: 100%;
	-ms-text-size-adjust: 100%;
}

table {
	mso-table-lspace: 0pt;
	mso-table-rspace: 0pt;
	border-collapse: collapse;
	border-spacing: 0px;
}

table td,
body,
.es-wrapper {
	padding: 0;
	Margin: 0;
}

.es-content,
.es-header,
.es-footer {
	table-layout: fixed !important;
	width: 100%;
}

img {
	display: block;
	border: 0;
	outline: none;
	text-decoration: none;
	-ms-interpolation-mode: bicubic;
}

p,
hr {
	Margin: 0;
}

h1,
h2,
h3,
h4,
h5 {
	Margin: 0;
	line-height: 120%;
	mso-line-height-rule: exactly;
	font-family: Imprima, Arial, sans-serif;
}

p,
ul li,
ol li,
a {
	-webkit-text-size-adjust: none;
	-ms-text-size-adjust: none;
	mso-line-height-rule: exactly;
}

.es-left {
	float: left;
}

.es-right {
	float: right;
}

.es-p5 {
	padding: 5px;
}

.es-p5t {
	padding-top: 5px;
}

.es-p5b {
	padding-bottom: 5px;
}

.es-p5l {
	padding-left: 5px;
}

.es-p5r {
	padding-right: 5px;
}

.es-p10 {
	padding: 10px;
}

.es-p10t {
	padding-top: 10px;
}

.es-p10b {
	padding-bottom: 10px;
}

.es-p10l {
	padding-left: 10px;
}

.es-p10r {
	padding-right: 10px;
}

.es-p15 {
	padding: 15px;
}

.es-p15t {
	padding-top: 15px;
}

.es-p15b {
	padding-bottom: 15px;
}

.es-p15l {
	padding-left: 15px;
}

.es-p15r {
	padding-right: 15px;
}

.es-p20 {
	padding: 20px;
}

.es-p20t {
	padding-top: 20px;
}

.es-p20b {
	padding-bottom: 20px;
}

.es-p20l {
	padding-left: 20px;
}

.es-p20r {
	padding-right: 20px;
}

.es-p25 {
	padding: 25px;
}

.es-p25t {
	padding-top: 25px;
}

.es-p25b {
	padding-bottom: 25px;
}

.es-p25l {
	padding-left: 25px;
}

.es-p25r {
	padding-right: 25px;
}

.es-p30 {
	padding: 30px;
}

.es-p30t {
	padding-top: 30px;
}

.es-p30b {
	padding-bottom: 30px;
}

.es-p30l {
	padding-left: 30px;
}

.es-p30r {
	padding-right: 30px;
}

.es-p35 {
	padding: 35px;
}

.es-p35t {
	padding-top: 35px;
}

.es-p35b {
	padding-bottom: 35px;
}

.es-p35l {
	padding-left: 35px;
}

.es-p35r {
	padding-right: 35px;
}

.es-p40 {
	padding: 40px;
}

.es-p40t {
	padding-top: 40px;
}

.es-p40b {
	padding-bottom: 40px;
}

.es-p40l {
	padding-left: 40px;
}

.es-p40r {
	padding-right: 40px;
}

.es-menu td {
	border: 0;
}

.es-menu td a img {
	display: inline-block !important;
	vertical-align: middle;
}

/*
END CONFIG STYLES
*/
s {
	text-decoration: line-through;
}

p,
ul li,
ol li {
	font-family: Imprima, Arial, sans-serif;
	line-height: 150%;
}

ul li,
ol li {
	Margin-bottom: 15px;
	margin-left: 0;
}

a {
	text-decoration: underline;
}

.es-menu td a {
	text-decoration: none;
	display: block;
	font-family: Imprima, Arial, sans-serif;
}

.es-wrapper {
	width: 100%;
	height: 100%;
	background-repeat: repeat;
	background-position: center top;
}

.es-wrapper-color,
.es-wrapper {
	background-color: #ffffff;
}

.es-header {
	background-color: transparent;
	background-repeat: repeat;
	background-position: center top;
}

.es-header-body {
	background-color: #efefef;
}

.es-header-body p,
.es-header-body ul li,
.es-header-body ol li {
	color: #2d3142;
	font-size: 14px;
}

.es-header-body a {
	color: #2d3142;
	font-size: 14px;
}

.es-content-body {
	background-color: #efefef;
}

.es-content-body p,
.es-content-body ul li,
.es-content-body ol li {
	color: #2d3142;
	font-size: 18px;
}

.es-content-body a {
	color: #2d3142;
	font-size: 18px;
}

.es-footer {
	background-color: transparent;
	background-repeat: repeat;
	background-position: center top;
}

.es-footer-body {
	background-color: #ffffff;
}

.es-footer-body p,
.es-footer-body ul li,
.es-footer-body ol li {
	color: #2d3142;
	font-size: 14px;
}

.es-footer-body a {
	color: #2d3142;
	font-size: 14px;
}

.es-infoblock,
.es-infoblock p,
.es-infoblock ul li,
.es-infoblock ol li {
	line-height: 120%;
	font-size: 12px;
	color: #cccccc;
}

.es-infoblock a {
	font-size: 12px;
	color: #cccccc;
}

h1 {
	font-size: 48px;
	font-style: normal;
	font-weight: bold;
	color: #2d3142;
}

h2 {
	font-size: 36px;
	font-style: normal;
	font-weight: bold;
	color: #2d3142;
}

h3 {
	font-size: 28px;
	font-style: normal;
	font-weight: bold;
	color: #2d3142;
}

.es-header-body h1 a,
.es-content-body h1 a,
.es-footer-body h1 a {
	font-size: 48px;
}

.es-header-body h2 a,
.es-content-body h2 a,
.es-footer-body h2 a {
	font-size: 36px;
}

.es-header-body h3 a,
.es-content-body h3 a,
.es-footer-body h3 a {
	font-size: 28px;
}

a.es-button,
button.es-button {
	padding: 15px 20px 15px 20px;
	display: inline-block;
	background: #4114F7;
	border-radius: 30px;
	font-size: 22px;
	font-family: Imprima, Arial, sans-serif;
	font-weight: bold;
	font-style: normal;
	line-height: 120%;
	color: #ffffff;
	text-decoration: none;
	width: auto;
	text-align: center;
	mso-padding-alt: 0;
	mso-border-alt: 10px solid #4114F7;
}

.es-button-border {
	border-style: solid solid solid solid;
	border-color: #2cb543 #2cb543 #2cb543 #2cb543;
	background: #4114F7;
	border-width: 0px 0px 0px 0px;
	display: flex;
	border-radius: 30px;
	width: 250px;
}

.msohide {
	mso-hide: all;
}

/* RESPONSIVE STYLES Please do not delete and edit CSS styles below. If you don't need responsive layout, please delete this section. */
@media only screen and (max-width: 600px) {

	p,
	ul li,
	ol li,
	a {
		line-height: 150% !important;
	}

	h1,
	h2,
	h3,
	h1 a,
	h2 a,
	h3 a {
		line-height: 120%;
	}

	h1 {
		font-size: 30px !important;
		text-align: left;
	}

	h2 {
		font-size: 24px !important;
		text-align: left;
	}

	h3 {
		font-size: 20px !important;
		text-align: left;
	}

	.es-header-body h1 a,
	.es-content-body h1 a,
	.es-footer-body h1 a {
		font-size: 30px !important;
		text-align: left;
	}

	.es-header-body h2 a,
	.es-content-body h2 a,
	.es-footer-body h2 a {
		font-size: 24px !important;
		text-align: left;
	}

	.es-header-body h3 a,
	.es-content-body h3 a,
	.es-footer-body h3 a {
		font-size: 20px !important;
		text-align: left;
	}

	.es-menu td a {
		font-size: 14px !important;
	}

	.es-header-body p,
	.es-header-body ul li,
	.es-header-body ol li,
	.es-header-body a {
		font-size: 14px !important;
	}

	.es-content-body p,
	.es-content-body ul li,
	.es-content-body ol li,
	.es-content-body a {
		font-size: 14px !important;
	}

	.es-footer-body p,
	.es-footer-body ul li,
	.es-footer-body ol li,
	.es-footer-body a {
		font-size: 14px !important;
	}

	.es-infoblock p,
	.es-infoblock ul li,
	.es-infoblock ol li,
	.es-infoblock a {
		font-size: 12px !important;
	}

	*[class="gmail-fix"] {
		display: none !important;
	}

	.es-m-txt-c,
	.es-m-txt-c h1,
	.es-m-txt-c h2,
	.es-m-txt-c h3 {
		text-align: center !important;
	}

	.es-m-txt-r,
	.es-m-txt-r h1,
	.es-m-txt-r h2,
	.es-m-txt-r h3 {
		text-align: right !important;
	}

	.es-m-txt-l,
	.es-m-txt-l h1,
	.es-m-txt-l h2,
	.es-m-txt-l h3 {
		text-align: left !important;
	}

	.es-m-txt-r img,
	.es-m-txt-c img,
	.es-m-txt-l img {
		display: inline !important;
	}

	.es-button-border {
		display: block !important;
	}

	a.es-button,
	button.es-button {
		font-size: 18px !important;
		display: block !important;
		border-right-width: 0px !important;
		border-left-width: 0px !important;
		border-top-width: 15px !important;
		border-bottom-width: 15px !important;
	}

	.es-adaptive table,
	.es-left,
	.es-right {
		width: 100% !important;
	}

	.es-content table,
	.es-header table,
	.es-footer table,
	.es-content,
	.es-footer,
	.es-header {
		width: 100% !important;
		max-width: 600px !important;
	}

	.es-adapt-td {
		display: block !important;
		width: 100% !important;
	}

	.adapt-img {
		width: 100% !important;
		height: auto !important;
	}

	.es-m-p0 {
		padding: 0px !important;
	}

	.es-m-p0r {
		padding-right: 0px !important;
	}

	.es-m-p0l {
		padding-left: 0px !important;
	}

	.es-m-p0t {
		padding-top: 0px !important;
	}

	.es-m-p0b {
		padding-bottom: 0 !important;
	}

	.es-m-p20b {
		padding-bottom: 20px !important;
	}

	.es-mobile-hidden,
	.es-hidden {
		display: none !important;
	}

	tr.es-desk-hidden,
	td.es-desk-hidden,
	table.es-desk-hidden {
		width: auto !important;
		overflow: visible !important;
		float: none !important;
		max-height: inherit !important;
		line-height: inherit !important;
	}

	tr.es-desk-hidden {
		display: table-row !important;
	}

	table.es-desk-hidden {
		display: table !important;
	}

	td.es-desk-menu-hidden {
		display: table-cell !important;
	}

	.es-menu td {
		width: 1% !important;
	}

	table.es-table-not-adapt,
	.esd-block-html table {
		width: auto !important;
	}

	table.es-social {
		display: inline-block !important;
	}

	table.es-social td {
		display: inline-block !important;
	}

	.es-desk-hidden {
		display: table-row !important;
		width: auto !important;
		overflow: visible !important;
		max-height: inherit !important;
	}
}

/* END RESPONSIVE STYLES */
html,
body {
	font-family: arial, 'helvetica neue', helvetica, sans-serif;
}

.es-p-default {
	padding-top: 20px;
	padding-right: 40px;
	padding-bottom: 0px;
	padding-left: 40px;
}

.es-p-all-default {
	padding: 0px;
}
        /* ... (Thêm đoạn CSS của bạn ở đây) ... */
    </style>
</head>

<body>
    <div dir="ltr" class="es-wrapper-color">
        <!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#ffffff"></v:fill>
			</v:background>
		<![endif]-->
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                <td class="esd-stripe" align="center">
    <table bgcolor="#efefef" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="border-radius: 20px 20px 0 0 ">
        <tbody>
            <tr>
                <td class="esd-structure es-p40t es-p40r es-p40l" align="left">
                    <table cellpadding="0" cellspacing="0" width="100%">
                        <tbody>
                            <tr>
                                <td width="520" class="esd-container-frame" align="center" valign="top">
                                    <table cellpadding="0" cellspacing="0" width="100%">
                                        <tbody>
                                            <tr>
                                                <td align="left" class="esd-block-image es-m-txt-c" style="font-size: 0px;"><a><img src="https://demo.stripocdn.email/content/guids/549c6833-ecb6-463e-b444-8b31671eae94/images/icons8verify480.png" alt="Confirm email" style="display: block; border-radius: 100px;" width="100" title="Confirm email"></a></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td class="es-p20t es-p40r es-p40l esd-structure" align="left">
                    <table cellpadding="0" cellspacing="0" width="100%">
                        <tbody>
                            <tr>
                                <td width="520" class="esd-container-frame" align="center" valign="top">
                                    <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#fafafa" style="background-color: #fafafa; border-radius: 10px; border-collapse: separate;">
                                        <tbody>
                                            <tr>
                                                <td align="left" class="esd-block-text es-p20">
                                                    <h3 style="font-family: 'source sans pro', 'helvetica neue', helvetica, arial, sans-serif; font-size: 35px;">Xin chào, ${name}</h3>
                                                    <p><br></p>
                                                    <p style="font-family: 'source sans pro', 'helvetica neue', helvetica, arial, sans-serif;">Chúng tôi thấy bạn đang gửi yêu cầu xác thực địa chỉ email này để tạo tài khoản trên <strong>Hymns Center</strong>.
																											<!-- <br>Để xác nhận email đăng ký, bạn vui lòng click vào nút "Xác thực".</p> -->
                                                </td>
                                            </tr>
																						 <td align="left" class="esd-block-text es-p20">
                                                    <p style="font-family: 'source sans pro', 'helvetica neue', helvetica, arial, sans-serif;">Để xác nhận email đăng ký, bạn vui lòng click vào nút "Xác thực".<br></p>
                                                </td>
                                            <tr>
                                                <td align="center" class="esd-block-button">
                                                  <span class="msohide es-button-border" style="display: block; background: #436e67;"><a href="${verificationLink}" class="es-button msohide" target="_blank" style="padding-left: 5px; padding-right: 5px; display: block; background: #436e67; font-family: &quot;source sans pro&quot;, &quot;helvetica neue&quot;, helvetica, arial, sans-serif; font-weight: bold;">Confirm email</a></span>
                                               
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left" class="esd-block-text es-p20">
                                                    <h3 style="font-family: 'source sans pro', 'helvetica neue', helvetica, arial, sans-serif; font-size: 35px;"><br></h3>
                                                    <p style="font-family: 'source sans pro', 'helvetica neue', helvetica, arial, sans-serif;">Trong trường hợp nút "Xác thực" không hoạt động, bạn hãy copy link dưới và dán vào trình duyệt.<br></p>
                                                    <p style="font-family: 'source sans pro', 'helvetica neue', helvetica, arial, sans-serif;">${verificationLink}<br></p>
                                                </td>
                                            </tr>
																						  <tr>
                                                <td align="left" class="esd-block-text es-p20">
                                                    <h3 style="font-family: 'source sans pro', 'helvetica neue', helvetica, arial, sans-serif; font-size: 35px;"><br></h3>
                                                 <p style="font-family: 'source sans pro', 'helvetica neue', helvetica, arial, sans-serif;">Chúng tôi xin chân thành cảm ơn.<br>Trân trọng,<br>Hymnscenter team,</p>
                                                    <p style="font-family: 'source sans pro', 'helvetica neue', helvetica, arial, sans-serif;"><br></p>
                                                </td>
                                            </tr>
																						 
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td class="esd-structure es-p40r es-p40l" align="left">
                    <table cellpadding="0" cellspacing="0" width="100%">
                        <tbody>
                            <tr>
                                <td width="520" class="esd-container-frame" align="center" valign="top">
                                    <table cellpadding="0" cellspacing="0" width="100%">
                                        <tbody>
                                         
                                            <tr>
                                                <td align="center" class="esd-block-spacer es-p40t es-p20b" style="font-size:0">
                                                    <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="border-bottom: 1px solid #666666; background: unset; height: 1px; width: 100%; margin: 0px;"></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>
	`;
	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: process.env.MAIL_ACCOUNT, // sender address
		to: email, // list of receivers
		subject: `Mã xác minh của bạn`, // Subject line
		html: `${listItem} `,
		text: `Mã xác minh của bạn là ${verificationLink}`,
	});
};
module.exports = {
	sendEmailVerify,
};
