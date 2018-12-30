give @s minecraft:chainmail_chestplate{CustomModelData:5}
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"minecraft:iron_chestplate",tag:{CustomModelData:1}}]}
execute if entity @s[nbt={SelectedItem:{id:"minecraft:iron_chestplate",tag:{CustomModelData:1}}}]