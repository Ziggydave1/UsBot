import { MessageEmbed } from "discord.js";

export default class Success extends MessageEmbed {
    constructor(message: string) {
        super();
        this.setColor('GREEN')
        .setTitle(message);
    }
}