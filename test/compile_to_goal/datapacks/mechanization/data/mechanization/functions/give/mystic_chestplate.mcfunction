give @s minecraft:chainmail_chestplate{CustomModelData:1}
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"minecraft:chainmail_chestplate",tag:{CustomModelData:1}}]}
execute if entity @s[nbt={SelectedItem:{id:"minecraft:chainmail_chestplate",tag:{CustomModelData:1}}}]