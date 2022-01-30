import { MessageEmbed } from "discord.js";

export default class Error extends MessageEmbed {
    constructor(message: string) {
        super();
        this.setColor('RED')
        .setTitle(message);
    }
}