# before
give @s minecraft:chainmail_chestplate{CustomModelData:5}
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"minecraft:chainmail_chestplate",tag:{CustomModelData:5}}]}
execute if @s[nbt={SelectedItem:{id:"minecraft:chainmail_chestplate",tag:{CustomModelData:5}}]
# after
give @s $mechanization:mystic_chestplate
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"$mechanization:mystic_chestplate"}]}
execute if @s[nbt={SelectedItem:{id:"$mechanization:chainmail_chestplate"}}]
