const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
var inlineBase64 = require("nodemailer-plugin-inline-base64");
const sendEmailCreateOrder = async (email,createdOrder) => {
	console.log("email",email);
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true, // use TLS
		auth: {
			user: process.env.MAIL_ACCOUNT, // generated ethereal user
			pass: process.env.MAIL_PASSWORD,
		},
	});
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

	listItem += `<!DOCTYPE html>
    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
    
    <head>
      <title></title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" type="text/css">
      <!--<![endif]-->
      <style>
        * {
          box-sizing: border-box
        }
    
        body {
          margin: 0;
          padding: 0;
          font-size: 14px;
          font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
    
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: inherit !important
        }
    
        #MessageViewBody a {
          color: inherit;
          text-decoration: none
        }
    
        p {
          line-height: inherit
        }
    
        .desktop_hide,
        .desktop_hide table {
          mso-hide: all;
          display: none;
          max-height: 0;
          overflow: hidden
        }
    
        @media (max-width:620px) {
    
          .image_block img.big,
          .row-content {
            width: 100% !important
          }
    
          .mobile_hide {
            display: none
          }
    
          .stack .column {
            width: 100%;
            display: block
          }
    
          .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0
          }
    
          .desktop_hide,
          .desktop_hide table {
            display: table !important;
            max-height: none !important
          }
        }
      </style>
    </head>
    
    <body style="margin:0;background-color:#fff;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none">
      <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
        style="mso-table-lspace:0;mso-table-rspace:0;background-color:#fff">
        <tbody>
          <tr>
            <td>
              
      <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
      <table class="paragraph_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
        <tr>
          <td style="width: 100%;text-align: left;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
            <div style="font-size: 14px;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;line-height: 120%;text-align: center;direction: ltr;letter-spacing: 1px;color: #4d1515;">
              <p style="margin:0;"><br/></p>
            </div>
          </td>
        </tr>
      </table>
      
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;background-size: auto;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;background-size: auto;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
      <table class="spacer_block" width="100%" border="0" cellpadding="0" cellspacing="0"
      role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
        <tr>
          <td style="padding-top: 60px;"></td>
        </tr>
      </table>
      
      <table class="title_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
        <tr>
          <td style="width: 100%;text-align: center;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          <h1 style="color: #436e67;font-size: 51px;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;line-height: 150%;text-align: center;direction: ltr;font-weight: 700;letter-spacing: 3px;background-color: #ffffff;margin: 0;padding: 0;">
            <span>HYMNS CENTER</span>
          </h1>
          </td>
        </tr>
      </table>
      
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
    <table class="divider_block" width="100%" border="0" cellpadding="0" cellspacing="0"
    role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
      <tr>
        <td style="padding-top: 5px;padding-right: 5px;padding-bottom: 5px;padding-left: 5px;">
          <div align="center">
            <div class="divider_inner"style="border-top: 1px solid #030203;width: 90%;"></div>
          </div>
        </td>
      </tr>
    </table>
    
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;background-size: auto;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;background-size: auto;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
      <table class="title_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
        <tr>
          <td style="width: 100%;text-align: center;padding-top: 20px;padding-right: 0px;padding-bottom: 20px;padding-left: 0px;">
          <h1 style="color: #393d47;font-size: 29px;font-family: inherit;line-height: 120%;text-align: center;direction: ltr;font-weight: 700;letter-spacing: 0px;margin: 0;padding: 0;">
            <span>Chào ${createdOrder?.shippingAddress?.fullName
		}, cảm ơn bạn đã mua hàng tại Hymns!</span>
          </h1>
          </td>
        </tr>
      </table>
      
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;background-size: auto;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;background-size: auto;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
      <table class="paragraph_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
        <tr>
          <td style="width: 100%;text-align: left;padding-top: 0px;padding-right: 0px;padding-bottom: 20px;padding-left: 0px;">
            <div style="font-size: 20px;font-family: inherit;line-height: 120%;text-align: center;direction: ltr;letter-spacing: 0px;">
              <p style="margin:0;"><span style="color: rgb(74, 74, 74); font-size: 16px">Chúng tôi đã nhận đơn hàng của bạn ngày: ${convert(
			createdOrder?.createdAt
		)}
              , và chúng tôi đang tiến hành xử lý đơn hàng.</span></p>
            </div>
          </td>
        </tr>
      </table>
      
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;background-size: auto;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;background-size: auto;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
    <table class="divider_block" width="100%" border="0" cellpadding="0" cellspacing="0"
    role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
      <tr>
        <td style="padding-top: 5px;padding-right: 5px;padding-bottom: 5px;padding-left: 5px;">
          <div align="center">
            <div class="divider_inner"style="border-top: 1px solid #bbbbbb;width: 90%;"></div>
          </div>
        </td>
      </tr>
    </table>
    
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;background-size: auto;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;background-size: auto;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="66.667%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
      <table class="spacer_block" width="100%" border="0" cellpadding="0" cellspacing="0"
      role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
        <tr>
          <td style="padding-top: 20px;"></td>
        </tr>
      </table>
      
      <table class="title_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
        <tr>
          <td style="width: 100%;text-align: center;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 10px;">
          <h1 style="color: #436e67;font-size: 23px;font-family: inherit;line-height: 120%;text-align: left;direction: ltr;font-weight: 700;letter-spacing: 0px;margin: 0;padding: 0;">
            <span>Thông Tin Đơn Hàng Của Bạn</span>
          </h1>
          </td>
        </tr>
      </table>
      
        </td>
        
        <td class="column column-2" width="33.333%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;background-size: auto;">
        <tbody>
        <tbody>
        <tr>
          <td>
             <td>
                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
                role="presentation"
                style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;background-size: auto;width: 805px;"
                width="805">
                  <tbody>
                  ${createdOrder?.orderItems
			?.map((order) => {
				return ` 
                    <tr>
          <td class="column column-1" width="33.333%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
            
          <table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0"
          role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
            <tr>
              <td style="width: 100%;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
                <div align="center">
                  <img
          class="center autowidth"
          src="${order?.image}"
          alt="${order?.name}"
          style="display:block;height:300px;border:0;width:auto;max-width:100%">
                </div>
              </td>
            </tr>
          </table>
        
          </td>
          
          <td class="column column-2" width="66.667%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
            
        <table class="spacer_block" width="100%" border="0" cellpadding="0" cellspacing="0"
        role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
          <tr>
            <td style="padding-top: 2px;"></td>
          </tr>
        </table>
        
        <table class="title_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
          <tr>
            <td style="width: 100%;text-align: center;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
            <h3 style="color: #393d47;font-size: 24px;font-family: Arial, Helvetica Neue, Helvetica, sans-serif;line-height: 150%;text-align: left;direction: ltr;font-weight: 400;letter-spacing: 0px;margin: 0; padding-top: 10px">
              <span>
              <strong class="hhg-bold">${order.name}</strong></span>
            </h3>
            </td>
          </tr>
        </table>
        
        <table class="spacer_block" width="100%" border="0" cellpadding="0" cellspacing="0"
        role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
          <tr>
            <td style="padding-top: 10px;"></td>
          </tr>
        </table>
        
        <table class="paragraph_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
          <tr>
            <td style="width: 100%;text-align: left;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
              <div style="font-size: 14px;font-family: inherit;line-height: 120%;text-align: right;direction: ltr;letter-spacing: 0px;">
                <p style="margin:0;"><span style="color: rgb(74, 74, 74); font-size: 16px">Số lượng: ${order?.amount
					}</span></p>
              </div>
            </td>
          </tr>
        </table>
        </br>
        <table class="spacer_block" width="100%" border="0" cellpadding="0" cellspacing="0"
        role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
          <tr>
            <td style="padding-top: 10px;"></td>
          </tr>
        </table>
        
        <table class="paragraph_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
          <tr>
            <td style="width: 100%;text-align: left;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
              <div style="font-size: 14px;font-family: inherit;line-height: 120%;text-align: right;direction: ltr;letter-spacing: 0px;">
                <p style="margin:0;"><span style="color: rgb(74, 74, 74); font-size: 16px">Tổng: ${formatter.format(
						order.price
					)}</span></p>
              </div>
            </td>
          </tr>
        </table>`;
			})
			.join("")}
          </td>
          </tr>
                  </tbody>
                </table>
                
           
              </td>;
           
          </td>
        </tr>
      </tbody>
          <tr>
            

        
          </tr>
        </tbody>
      </table>
      
      <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
    <table class="divider_block" width="100%" border="0" cellpadding="0" cellspacing="0"
    role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
      <tr>
        <td style="padding-top: 5px;padding-right: 5px;padding-bottom: 5px;padding-left: 5px;">
          <div align="center">
            <div class="divider_inner"style="border-top: 2px solid #bbbbbb;width: 90%;"></div>
          </div>
        </td>
      </tr>
    </table>
    
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;background-size: auto;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;background-size: auto;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
      <table class="paragraph_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
        <tr>
          <td style="width: 100%;text-align: left;padding-top: 20px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
            <div style="font-size: 14px;font-family: inherit;line-height: 120%;text-align: right;direction: ltr;letter-spacing: 0px;">
              <p style="margin:0;"><span style="color: rgb(74, 74, 74); font-size: 16px">Tổng tiền: </span><strong class="hhg-bold">
           ${formatter.format(createdOrder?.itemsPrice)}
              </strong></p>
            </div>
          </td>
        </tr>
      </table>
      
      <table class="spacer_block" width="100%" border="0" cellpadding="0" cellspacing="0"
      role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
        <tr>
          <td style="padding-top: 10px;"></td>
        </tr>
      </table>
      
      <table class="paragraph_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
        <tr>
          <td style="width: 100%;text-align: left;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
            <div style="font-size: 14px;font-family: inherit;line-height: 120%;text-align: right;direction: ltr;letter-spacing: 0px;">
              <p style="margin:0;"><span style="color: rgb(74, 74, 74); font-size: 16px">Giao hàng: </span><strong class="hhg-bold">
                ${formatter.format(createdOrder?.shippingPrice)}
              </strong></p>
            </div>
          </td>
        </tr>
      </table>
      
      <table class="spacer_block" width="100%" border="0" cellpadding="0" cellspacing="0"
      role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
        <tr>
          <td style="padding-top: 10px;"></td>
        </tr>
      </table>
      
      <table class="paragraph_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
        <tr>
          <td style="width: 100%;text-align: left;padding-top: 0px;padding-right: 0px;padding-bottom: 20px;padding-left: 0px;">
            <div style="font-size: 14px;font-family: inherit;line-height: 120%;text-align: right;direction: ltr;letter-spacing: 0px;">
              <p style="margin:0;"><span style="color: rgb(74, 74, 74); font-size: 16px">Tổng: </span><strong class="hhg-bold">
                 ${formatter.format(createdOrder?.totalPrice)}
              </strong></p>
            </div>
          </td>
        </tr>
      </table>
      
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
    <table class="divider_block" width="100%" border="0" cellpadding="0" cellspacing="0"
    role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
      <tr>
        <td style="padding-top: 9px;padding-right: 9px;padding-bottom: 9px;padding-left: 9px;">
          <div align="center">
            <div class="divider_inner"style="border-top: 1px solid #bbbbbb;width: 90%;"></div>
          </div>
        </td>
      </tr>
    </table>
    
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;background-size: auto;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;background-size: auto;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
      <table class="title_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
        <tr>
          <td style="width: 100%;text-align: center;padding-top: 20px;padding-right: 0px;padding-bottom: 0px;padding-left: 10px;">
          <h1 style="color: #436e67;font-size: 23px;font-family: inherit;line-height: 120%;text-align: left;direction: ltr;font-weight: 700;letter-spacing: 0px;margin: 0;padding: 0;">
            <span>Địa Chỉ Của Bạn</span>
          </h1>
          </td>
        </tr>
      </table>
      
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;background-size: auto;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;background-size: auto;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
      <table class="spacer_block" width="100%" border="0" cellpadding="0" cellspacing="0"
      role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
        <tr>
          <td style="padding-top: 10px;"></td>
        </tr>
      </table>
      
      <table class="paragraph_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
        <tr>
          <td style="width: 100%;text-align: left;padding-top: 1px;padding-right: 1px;padding-bottom: 20px;padding-left: 10px;">
            <div style="font-size: 14px;font-family: inherit;line-height: 150%;text-align: left;direction: ltr;letter-spacing: 0px;">
              <p style="margin:0;">Địa Chỉ Nhận Hàng:</p><p style="margin:0;margin-top:5px"><strong class="hhg-bold">VũLê<br>
							${createdOrder?.shippingAddress?.address} 
							<br>${createdOrder?.shippingAddress?.ward}
		<br>${createdOrder?.shippingAddress?.city}
				<br>${createdOrder?.shippingAddress?.province}
		<br>Việt Nam</strong></p>
            </div>
          </td>
        </tr>
      </table>
      
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-14" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
    <table class="divider_block" width="100%" border="0" cellpadding="0" cellspacing="0"
    role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
      <tr>
        <td style="padding-top: 5px;padding-right: 5px;padding-bottom: 5px;padding-left: 5px;">
          <div align="center">
            <div class="divider_inner"style="border-top: 1px solid #bbbbbb;width: 90%;"></div>
          </div>
        </td>
      </tr>
    </table>
    
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-15" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
      <table class="title_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
        <tr>
          <td style="width: 100%;text-align: center;padding-top: 20px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          <h1 style="color: #436e67;font-size: 23px;font-family: inherit;line-height: 120%;text-align: left;direction: ltr;font-weight: 700;letter-spacing: 0px;margin: 0;padding: 0;">
            <span>Giao Nhận Hàng Tiêu Chuẩn</span>
          </h1>
          </td>
        </tr>
      </table>
      
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-16" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;background-size: auto;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;background-image: none;background-position: top left;background-repeat: no-repeat;color: #000000;background-size: auto;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: transparent;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;">
          
        <table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0"
        role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
          <tr>
            <td style="width: 100%;padding-top: 20px;padding-right: 0px;padding-bottom: 20px;padding-left: 0px;">
              <div align="center">
                <img
        class="center fixedwidth fullwidthOnMobile"
        src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/364747999_3658037527760345_8244822559269832975_n.jpg?_nc_cat=102&cb=99be929b-3346023f&ccb=1-7&_nc_sid=730e14&_nc_ohc=eMDpNLFc9P8AX-_5kFw&_nc_ht=scontent.fdad3-5.fna&oh=00_AfBM4_00A7e3ydNIBAltM390fVDf2_tuZ1ECzhWFLUFwiw&oe=64D2EA1B"
        alt=""
        style="display:block;height:auto;border:0;width:458.85px;max-width:100%">
              </div>
            </td>
          </tr>
        </table>
      
        </td>
        </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table class="row row-17" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color: #ffffff;">
        <tbody>
          <tr>
            <td>
              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0"
              role="presentation"
              style="mso-table-lspace:0;mso-table-rspace:0;background-color: transparent;color: #333;background-image: url('');background-position: top left;background-size: auto;background-repeat: no-repeat;width: 805px;"
              width="805">
                <tbody>
                  <tr>
        <td class="column column-1" width="100.000%" style="mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;background-color: #000000;border-bottom: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-top: 0px solid transparent;padding-bottom: 30px;padding-left: 0px;padding-right: 0px;padding-top: 30px;">
          
      <table class="paragraph_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
        <tr>
          <td style="padding-bottom: 5px;padding-left: 5px;padding-right: 5px;padding-top: 5px;">
            <div style="color: #ffffff;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;line-height: 150%;font-size: 14px;text-align: center;">
              <p style="margin:0;"><strong class="hhg-bold">- THEO DÕI HYMNS -</strong></p>
            </div>
          </td>
        </tr>
      </table>
      
    <table class="social_block" width="100%" cellpadding="10" cellspacing="0" role="presentation">
      <tbody>
        <tr>
          <td style="color: #000000;font-family: inherit;font-size: 14px;padding-bottom: 0px;padding-left: 0px;padding-right: 0px;padding-top: 0px;text-align: center;">
            <table class="social-table" width="217.72859025032938px" cellpadding="0" cellspacing="0" role="presentation"
              align="center">
              <tbody>
                <tr>
                  <td style="padding: 0px 2px;"><a href="https://www.facebook.com/hymnsguitarclass" rel="noreferrer"
                      target="_blank"><img
                        src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png"
                        width="32" height="32" alt="Facebook" title="Facebook"
                        style="display: block; height: auto; border: 0px;"></a></td>
                  <td style="padding: 0px 2px;"><a href="https://www.instagram.com/vulee___/" rel="noreferrer"
                      target="_blank"><img
                        src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png"
                        width="32" height="32" alt="Instagram" title="Instagram"
                        style="display: block; height: auto; border: 0px;"></a></td>
                  <td style="padding: 0px 2px;"><a href="https://www.youtube.com/channel/UCm3Zd0TwavjASEmK8aIbvvQ" rel="noreferrer"
                      target="_blank"><img
                        src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png"
                        width="32" height="32" alt="YouTube" title="YouTube"
                        style="display: block; height: auto; border: 0px;"></a></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  
      <table class="paragraph_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
        <tr>
          <td style="padding-bottom: 20px;padding-left: 20px;padding-right: 20px;padding-top: 20px;">
            <div style="color: #ffffff;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;line-height: 150%;text-align: center;font-size: 14px;">
              <p style="margin:0;"><em>Copyright © 2023 Hymns Center, All rights reserved.</em><br>Bạn nhận được email này khi mua hàng tại Hymns Center<br><br><strong class="hhg-bold">Mọi thông tin vui lòng liên hệ:</strong><br>Hymns Center<br>Kiệt 03/31, đường Nguyễn Hoàng, Phương Hoà Đông, Phường Hoà Thuận</p><p style="margin:0;margin-top:0">TP. Tam Kỳ, tỉnh Quảng Nam</p>
            </div>
          </td>
        </tr>
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
      </table><!-- End -->
    </body>
  </html>`;
	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: process.env.MAIL_ACCOUNT, // sender address
		to: "hymnscenter@gmail.com" && email, // list of receivers
		subject: `Xác nhận đơn hàng ${createdOrder?.codeOrder} tại Hymns Center`, // Subject line
		text: "", // plain text body
		html: `${listItem} `,
		attachments: attachImage,
	});
};

module.exports = {
	sendEmailCreateOrder,
};
