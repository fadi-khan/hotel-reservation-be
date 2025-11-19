import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const setupSwagger= (app:INestApplication)=>{

    const config = new DocumentBuilder()
    .setTitle("Hotel Reservation Api ")
    .setDescription("Hotel Reservation Api Documentation")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app,config);
    SwaggerModule.setup("api/docs",app,document,{
        swaggerOptions:{
            persistAuthorization:true

        }
    })

}