give @s $mechanization:mystic_chestplate
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"$mechanization:mystic_chestplate"}]}
execute if entity @s[nbt={SelectedItem:{id:"$mechanization:mystic_chestplate"}}]
